using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Souq.Api.Domain;
using Souq.Api.Persistence;

namespace Souq.Api.Features.Favorites;

[ApiController]
[Route("api/listings/{id:guid}/favorite")]
public sealed class FavoritesController(SouqDbContext db) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Add(Guid id, [FromQuery] Guid? userId)
    {
        if (userId is null) return BadRequest(new { error = "userId is required (auth deferred)" });

        var listingExists = await db.Listings.AnyAsync(l => l.Id == id && l.DeletedAt == null);
        if (!listingExists) return NotFound(new { error = "listing not found" });

        var already = await db.Favorites.AnyAsync(f => f.UserId == userId.Value && f.ListingId == id);
        if (already) return NoContent();

        db.Favorites.Add(new EngFavorite
        {
            UserId = userId.Value,
            ListingId = id,
        });
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete]
    public async Task<IActionResult> Remove(Guid id, [FromQuery] Guid? userId)
    {
        if (userId is null) return BadRequest(new { error = "userId is required (auth deferred)" });

        var fav = await db.Favorites.FirstOrDefaultAsync(f => f.UserId == userId.Value && f.ListingId == id);
        if (fav is null) return NoContent();

        db.Favorites.Remove(fav);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
