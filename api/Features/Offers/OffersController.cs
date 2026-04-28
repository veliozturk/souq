using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Souq.Api.Domain;
using Souq.Api.Persistence;

namespace Souq.Api.Features.Offers;

[ApiController]
public sealed class OffersController(SouqDbContext db) : ControllerBase
{
    [HttpPost("api/listings/{id:guid}/offers")]
    public async Task<IActionResult> Make(Guid id, [FromBody] MakeOfferRequest req)
    {
        if (req.AmountAed <= 0) return BadRequest(new { error = "amountAed > 0 required" });

        var listing = await db.Listings.AsNoTracking()
            .Where(l => l.Id == id && l.DeletedAt == null)
            .Select(l => new { l.Id, l.SellerId, l.PriceAed })
            .FirstOrDefaultAsync();
        if (listing is null) return NotFound(new { error = "listing not found" });

        Guid buyerId, sellerId;
        if (req.UserId == listing.SellerId)
        {
            sellerId = req.UserId;
            buyerId = req.PeerId;
        }
        else
        {
            buyerId = req.UserId;
            sellerId = listing.SellerId;
        }

        var conv = await db.Conversations
            .FirstOrDefaultAsync(c => c.ListingId == listing.Id && c.BuyerId == buyerId && c.SellerId == sellerId);
        if (conv is null)
        {
            conv = new MsgConversation
            {
                ListingId = listing.Id,
                BuyerId = buyerId,
                SellerId = sellerId,
            };
            db.Conversations.Add(conv);
            await db.SaveChangesAsync();
        }

        var now = DateTime.UtcNow;
        var offer = new OfrOffer
        {
            ListingId = listing.Id,
            ConversationId = conv.Id,
            BuyerId = buyerId,
            SellerId = sellerId,
            AmountAed = req.AmountAed,
            ListedPriceAed = listing.PriceAed,
            Status = "new",
            ExpiresAt = now.AddHours(24),
            CreatedAt = now,
            UpdatedAt = now,
        };
        db.Offers.Add(offer);
        await db.SaveChangesAsync();

        db.Messages.Add(new MsgMessage
        {
            ConversationId = conv.Id,
            SenderId = req.UserId,
            MessageType = "offer",
            OfferId = offer.Id,
            CreatedAt = now,
            UpdatedAt = now,
        });
        conv.LastMessageAt = now;
        await db.SaveChangesAsync();

        return Ok(new { conversationId = conv.Id, offerId = offer.Id });
    }

    [HttpPost("api/offers/{id:guid}/counter")]
    public async Task<IActionResult> Counter(Guid id, [FromBody] CounterOfferRequest req)
    {
        if (req.AmountAed <= 0) return BadRequest(new { error = "amountAed > 0 required" });

        var orig = await db.Offers.FirstOrDefaultAsync(o => o.Id == id && o.DeletedAt == null);
        if (orig is null) return NotFound();
        if (orig.BuyerId != req.UserId && orig.SellerId != req.UserId) return StatusCode(403);

        var now = DateTime.UtcNow;
        orig.Status = "countered";
        orig.RespondedAt = now;

        var counter = new OfrOffer
        {
            ListingId = orig.ListingId,
            ConversationId = orig.ConversationId,
            BuyerId = orig.BuyerId,
            SellerId = orig.SellerId,
            AmountAed = req.AmountAed,
            ListedPriceAed = orig.ListedPriceAed,
            Status = "new",
            ExpiresAt = now.AddHours(24),
            CounterOfOfferId = orig.Id,
            CreatedAt = now,
            UpdatedAt = now,
        };
        db.Offers.Add(counter);
        await db.SaveChangesAsync();

        db.Messages.Add(new MsgMessage
        {
            ConversationId = orig.ConversationId,
            SenderId = req.UserId,
            MessageType = "offer",
            OfferId = counter.Id,
            CreatedAt = now,
            UpdatedAt = now,
        });
        var conv = await db.Conversations.FirstOrDefaultAsync(c => c.Id == orig.ConversationId);
        if (conv is not null) conv.LastMessageAt = now;
        await db.SaveChangesAsync();

        return Ok(new { offerId = counter.Id });
    }

    [HttpPatch("api/offers/{id:guid}")]
    public async Task<IActionResult> Decide(Guid id, [FromBody] DecideOfferRequest req)
    {
        if (req.Decision != "accepted" && req.Decision != "declined")
            return BadRequest(new { error = "decision must be 'accepted' or 'declined'" });

        var offer = await db.Offers.FirstOrDefaultAsync(o => o.Id == id && o.DeletedAt == null);
        if (offer is null) return NotFound();
        if (offer.BuyerId != req.UserId && offer.SellerId != req.UserId) return StatusCode(403);

        offer.Status = req.Decision;
        offer.RespondedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        return Ok(new { id = offer.Id, status = offer.Status });
    }
}
