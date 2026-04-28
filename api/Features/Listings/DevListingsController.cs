using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Souq.Api.Common;
using Souq.Api.Domain;
using Souq.Api.Persistence;

namespace Souq.Api.Features.Listings;

[ApiController]
[Route("api/listings")]
public sealed class DevListingsController(SouqDbContext db, IWebHostEnvironment env) : ControllerBase
{
    private IActionResult? RequireDev() => env.IsDevelopment() ? null : NotFound();

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateListingRequest req)
    {
        if (RequireDev() is { } gate) return gate;

        if (req.UserId == Guid.Empty) return BadRequest(new { error = "userId required" });
        if (req.CategoryId == Guid.Empty || req.ConditionId == Guid.Empty || req.NeighborhoodId == Guid.Empty)
            return BadRequest(new { error = "categoryId, conditionId, neighborhoodId required" });
        if (req.PriceAed < 0) return BadRequest(new { error = "priceAed must be >= 0" });
        var title = (req.Title ?? "").Trim();
        var description = (req.Description ?? "").Trim();
        if (title.Length == 0) return BadRequest(new { error = "title required" });

        var sellerExists = await db.Users.AnyAsync(u => u.Id == req.UserId && u.DeletedAt == null);
        if (!sellerExists) return BadRequest(new { error = "user not found" });

        var now = DateTime.UtcNow;
        var listing = new LstListing
        {
            SellerId = req.UserId,
            CategoryId = req.CategoryId,
            ConditionId = req.ConditionId,
            NeighborhoodId = req.NeighborhoodId,
            Title = new BilingualUgcText { Original = title, En = title, Ar = title },
            Description = new BilingualUgcText { Original = description, En = description, Ar = description },
            PriceAed = req.PriceAed,
            AcceptOffers = (short)(req.AcceptOffers ? 1 : 0),
            HasPickup = (short)(req.HasPickup ? 1 : 0),
            PickupNote = req.PickupNote,
            Status = "draft",
            CreatedAt = now,
            UpdatedAt = now,
        };
        db.Listings.Add(listing);
        await db.SaveChangesAsync();

        return Ok(new { id = listing.Id, status = listing.Status });
    }

    [HttpPost("{id:guid}/publish")]
    public async Task<IActionResult> Publish(Guid id, [FromQuery] Guid? userId)
    {
        if (RequireDev() is { } gate) return gate;

        if (userId is null) return BadRequest(new { error = "userId required" });

        var listing = await db.Listings.FirstOrDefaultAsync(l => l.Id == id && l.DeletedAt == null);
        if (listing is null) return NotFound();
        if (listing.SellerId != userId.Value) return StatusCode(403);

        var photoCount = await db.ListingPhotos.CountAsync(p => p.ListingId == id);
        if (photoCount == 0) return BadRequest(new { error = "at least one photo required to publish" });

        var now = DateTime.UtcNow;
        listing.Status = "active";
        listing.PublishedAt ??= now;
        listing.UpdatedAt = now;
        await db.SaveChangesAsync();

        return Ok(new { id = listing.Id, status = listing.Status, publishedAt = listing.PublishedAt });
    }

    [HttpPatch("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromQuery] Guid? userId, [FromBody] UpdateListingRequest req)
    {
        if (RequireDev() is { } gate) return gate;

        if (userId is null) return BadRequest(new { error = "userId required" });

        if (req.Status is not null && req.Status is not ("active" or "paused" or "sold"))
            return BadRequest(new { error = "status must be active, paused, or sold" });

        string? title = null;
        if (req.Title is not null)
        {
            title = req.Title.Trim();
            if (title.Length == 0) return BadRequest(new { error = "title must not be empty" });
        }

        if (req.PriceAed is { } price && price < 0)
            return BadRequest(new { error = "priceAed must be >= 0" });

        var listing = await db.Listings.FirstOrDefaultAsync(l => l.Id == id && l.DeletedAt == null);
        if (listing is null) return NotFound();
        if (listing.SellerId != userId.Value) return StatusCode(403);

        if (req.CategoryId is { } catId)
        {
            if (!await db.Categories.AnyAsync(c => c.Id == catId))
                return BadRequest(new { error = "categoryId not found" });
            listing.CategoryId = catId;
        }
        if (req.ConditionId is { } condId)
        {
            if (!await db.Conditions.AnyAsync(c => c.Id == condId))
                return BadRequest(new { error = "conditionId not found" });
            listing.ConditionId = condId;
        }
        if (req.NeighborhoodId is { } nbhId)
        {
            if (!await db.Neighborhoods.AnyAsync(n => n.Id == nbhId))
                return BadRequest(new { error = "neighborhoodId not found" });
            listing.NeighborhoodId = nbhId;
        }
        if (title is not null)
        {
            listing.Title = new BilingualUgcText { Original = title, En = title, Ar = title };
        }
        if (req.Description is not null)
        {
            var desc = req.Description.Trim();
            listing.Description = new BilingualUgcText { Original = desc, En = desc, Ar = desc };
        }
        if (req.PriceAed is { } newPrice)
        {
            listing.PriceAed = newPrice;
        }
        if (req.AcceptOffers is { } accept)
        {
            listing.AcceptOffers = (short)(accept ? 1 : 0);
        }
        if (req.Status is not null)
        {
            listing.Status = req.Status;
        }

        listing.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        return Ok(new { id = listing.Id, status = listing.Status });
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, [FromQuery] Guid? userId)
    {
        if (RequireDev() is { } gate) return gate;

        if (userId is null) return BadRequest(new { error = "userId required" });

        var listing = await db.Listings.FirstOrDefaultAsync(l => l.Id == id && l.DeletedAt == null);
        if (listing is null) return NotFound();
        if (listing.SellerId != userId.Value) return StatusCode(403);

        var now = DateTime.UtcNow;
        listing.DeletedAt = now;
        listing.UpdatedAt = now;
        await db.SaveChangesAsync();

        return Ok(new { id = listing.Id, deletedAt = listing.DeletedAt });
    }
}
