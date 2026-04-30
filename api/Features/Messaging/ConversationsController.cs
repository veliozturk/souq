using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Souq.Api.Common;
using Souq.Api.Domain;
using Souq.Api.Persistence;

namespace Souq.Api.Features.Messaging;

[ApiController]
[Route("api/conversations")]
public sealed class ConversationsController(SouqDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> List([FromQuery] Guid? userId)
    {
        if (userId is null) return BadRequest(new { error = "userId is required (auth deferred)" });
        var me = userId.Value;

        var rows = await db.Conversations
            .AsNoTracking()
            .Where(c => (c.BuyerId == me || c.SellerId == me) && c.DeletedAt == null)
            .OrderByDescending(c => c.LastMessageAt)
            .Select(c => new
            {
                conv = c,
                peer = c.BuyerId == me ? c.Seller : c.Buyer,
                listingId = c.Listing.Id,
                listingTitle = c.Listing.Title,
                listingPriceAed = c.Listing.PriceAed,
                listingCoverPhoto = c.Listing.Photos
                    .OrderBy(p => p.SortOrder)
                    .Select(p => new
                    {
                        url = p.Url.StartsWith("http") ? p.Url : "/uploads/" + p.Url,
                        thumbUrl = p.ThumbUrl == null ? null : (p.ThumbUrl.StartsWith("http") ? p.ThumbUrl : "/uploads/" + p.ThumbUrl),
                    })
                    .FirstOrDefault(),
                lastMessage = db.Messages
                    .Where(m => m.ConversationId == c.Id && m.DeletedAt == null)
                    .OrderByDescending(m => m.CreatedAt)
                    .Select(m => new { m.Id, m.SenderId, m.CreatedAt, m.MessageType, m.Text })
                    .FirstOrDefault(),
                lastReadCreatedAt = (c.BuyerId == me ? c.BuyerLastReadMessageId : c.SellerLastReadMessageId) == null
                    ? (DateTime?)null
                    : db.Messages
                        .Where(m => m.Id == (c.BuyerId == me ? c.BuyerLastReadMessageId : c.SellerLastReadMessageId))
                        .Select(m => (DateTime?)m.CreatedAt)
                        .FirstOrDefault(),
                hasOffer = db.Offers.Any(o => o.ConversationId == c.Id && o.DeletedAt == null),
            })
            .ToListAsync();

        var result = rows.Select(r => new
        {
            id = r.conv.Id,
            peer = new
            {
                id = r.peer.Id,
                displayName = r.peer.Name,
                avatarUrl = r.peer.AvatarUrl is null
                    ? null
                    : (r.peer.AvatarUrl.StartsWith("http") ? r.peer.AvatarUrl : "/uploads/" + r.peer.AvatarUrl),
                avatarInitial = r.peer.AvatarInitial,
                isOnline = false,
            },
            listing = new
            {
                id = r.listingId,
                title = r.listingTitle,
                priceAed = r.listingPriceAed,
                coverPhoto = r.listingCoverPhoto,
            },
            lastMessage = r.lastMessage is null ? null : new
            {
                text = r.lastMessage.MessageType == "offer" ? null : r.lastMessage.Text,
                createdAt = r.lastMessage.CreatedAt,
                fromMe = r.lastMessage.SenderId == me,
                kind = r.lastMessage.MessageType,
            },
            unread = r.lastMessage is not null
                     && r.lastMessage.SenderId != me
                     && (r.lastReadCreatedAt is null || r.lastMessage.CreatedAt > r.lastReadCreatedAt),
            hasOffer = r.hasOffer,
            iAmSeller = r.conv.SellerId == me,
        });

        return Ok(result);
    }

    [HttpGet("{id:guid}/messages")]
    public async Task<IActionResult> Messages(Guid id, [FromQuery] Guid? userId)
    {
        if (userId is null) return BadRequest(new { error = "userId is required (auth deferred)" });
        var me = userId.Value;

        var conv = await db.Conversations
            .AsNoTracking()
            .Where(c => c.Id == id && c.DeletedAt == null)
            .Select(c => new { c.BuyerId, c.SellerId })
            .FirstOrDefaultAsync();
        if (conv is null) return NotFound();
        if (conv.BuyerId != me && conv.SellerId != me) return StatusCode(403);

        var msgs = await db.Messages
            .AsNoTracking()
            .Where(m => m.ConversationId == id && m.DeletedAt == null)
            .OrderBy(m => m.CreatedAt)
            .Select(m => new
            {
                id = m.Id,
                conversationId = m.ConversationId,
                fromUserId = m.SenderId,
                fromMe = m.SenderId == me,
                createdAt = m.CreatedAt,
                kind = m.MessageType,
                text = m.Text,
                offer = m.OfferId == null ? null : db.Offers
                    .Where(o => o.Id == m.OfferId)
                    .Select(o => new
                    {
                        id = o.Id,
                        priceAed = o.AmountAed,
                        listedPriceAed = o.ListedPriceAed,
                        state = o.Status,
                    })
                    .FirstOrDefault(),
            })
            .ToListAsync();

        return Ok(msgs);
    }

    [HttpPost]
    public async Task<IActionResult> Start([FromBody] StartConversationRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Text))
            return BadRequest(new { error = "text required" });

        var listing = await db.Listings.AsNoTracking()
            .Where(l => l.Id == req.ListingId && l.DeletedAt == null)
            .Select(l => new { l.Id, l.SellerId })
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
        var msg = new MsgMessage
        {
            ConversationId = conv.Id,
            SenderId = req.UserId,
            MessageType = "text",
            Text = new BilingualUgcText { Original = req.Text, En = req.Text, Ar = req.Text },
            CreatedAt = now,
            UpdatedAt = now,
        };
        db.Messages.Add(msg);
        conv.LastMessageAt = now;
        await db.SaveChangesAsync();

        return Ok(new { conversationId = conv.Id, messageId = msg.Id });
    }

    [HttpPost("{id:guid}/messages")]
    public async Task<IActionResult> Send(Guid id, [FromBody] SendMessageRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Text))
            return BadRequest(new { error = "text required" });

        var conv = await db.Conversations.FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null);
        if (conv is null) return NotFound();
        if (conv.BuyerId != req.UserId && conv.SellerId != req.UserId)
            return StatusCode(403);

        var now = DateTime.UtcNow;
        var msg = new MsgMessage
        {
            ConversationId = id,
            SenderId = req.UserId,
            MessageType = "text",
            Text = new BilingualUgcText { Original = req.Text, En = req.Text, Ar = req.Text },
            CreatedAt = now,
            UpdatedAt = now,
        };
        db.Messages.Add(msg);
        conv.LastMessageAt = now;
        await db.SaveChangesAsync();

        return Ok(new
        {
            id = msg.Id,
            conversationId = msg.ConversationId,
            fromUserId = msg.SenderId,
            fromMe = true,
            createdAt = msg.CreatedAt,
            kind = msg.MessageType,
            text = msg.Text,
            offer = (object?)null,
        });
    }

    [HttpPatch("{id:guid}/read")]
    public async Task<IActionResult> MarkRead(Guid id, [FromQuery] Guid? userId)
    {
        if (userId is null) return BadRequest(new { error = "userId required" });

        var conv = await db.Conversations.FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null);
        if (conv is null) return NotFound();
        if (conv.BuyerId != userId.Value && conv.SellerId != userId.Value)
            return StatusCode(403);

        var lastMsgId = await db.Messages
            .Where(m => m.ConversationId == id && m.DeletedAt == null)
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => (Guid?)m.Id)
            .FirstOrDefaultAsync();
        if (lastMsgId is null) return NoContent();

        if (conv.BuyerId == userId.Value) conv.BuyerLastReadMessageId = lastMsgId;
        else conv.SellerLastReadMessageId = lastMsgId;
        await db.SaveChangesAsync();

        return NoContent();
    }
}
