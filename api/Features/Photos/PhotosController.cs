using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using SixLabors.ImageSharp;
using Souq.Api.Domain;
using Souq.Api.Persistence;
using Souq.Api.Storage;

namespace Souq.Api.Features.Photos;

[ApiController]
[Route("api/listings/{id:guid}/photos")]
public sealed class PhotosController(
    SouqDbContext db,
    IObjectStorage storage,
    PhotoProcessor processor,
    ILogger<PhotosController> logger) : ControllerBase
{
    private const int MaxPhotosPerListing = 9;

    [HttpPost]
    [IgnoreAntiforgeryToken]
    [EnableRateLimiting("uploads")]
    public async Task<IActionResult> Upload(Guid id, [FromQuery] Guid? userId, CancellationToken ct)
    {
        if (userId is null) return BadRequest(new { error = "userId required" });
        if (!Request.HasFormContentType) return BadRequest(new { error = "multipart/form-data required" });

        var listing = await db.Listings
            .Where(l => l.Id == id && l.DeletedAt == null)
            .Select(l => new { l.Id, l.SellerId })
            .FirstOrDefaultAsync(ct);
        if (listing is null) return NotFound(new { error = "listing not found" });
        if (listing.SellerId != userId.Value) return StatusCode(403);

        var form = await Request.ReadFormAsync(ct);
        var files = form.Files;
        if (files.Count == 0) return BadRequest(new { error = "no files" });

        var existingCount = await db.ListingPhotos.CountAsync(p => p.ListingId == id, ct);
        if (existingCount + files.Count > MaxPhotosPerListing)
            return Conflict(new { error = $"max {MaxPhotosPerListing} photos per listing" });

        foreach (var f in files)
        {
            if (f.Length == 0) return BadRequest(new { error = "empty file" });
            if (f.Length > PhotoProcessor.MaxInputBytes)
                return BadRequest(new { error = $"file too large ({f.FileName})" });
            if (!PhotoProcessor.AcceptedMimes.Contains(f.ContentType ?? ""))
                return StatusCode(StatusCodes.Status415UnsupportedMediaType);
        }

        var nextSort = (short)(await db.ListingPhotos
            .Where(p => p.ListingId == id)
            .Select(p => (int?)p.SortOrder)
            .MaxAsync(ct) + 1 ?? 0);
        var now = DateTime.UtcNow;
        var written = new List<string>();
        var rows = new List<LstListingPhoto>();

        try
        {
            foreach (var file in files)
            {
                PhotoProcessor.Result processed;
                await using (var input = file.OpenReadStream())
                {
                    processed = await processor.ProcessAsync(input, ct);
                }

                var photoId = Guid.NewGuid();
                var displayKey = $"listings/{id}/{photoId}/display.jpg";
                var thumbKey = $"listings/{id}/{photoId}/thumb.jpg";

                await using (var ms = new MemoryStream(processed.DisplayJpeg, writable: false))
                    await storage.PutAsync(displayKey, ms, "image/jpeg", ct);
                written.Add(displayKey);

                await using (var ms = new MemoryStream(processed.ThumbJpeg, writable: false))
                    await storage.PutAsync(thumbKey, ms, "image/jpeg", ct);
                written.Add(thumbKey);

                rows.Add(new LstListingPhoto
                {
                    Id = photoId,
                    ListingId = id,
                    Url = displayKey,
                    ThumbUrl = thumbKey,
                    SortOrder = nextSort++,
                    Width = processed.Width,
                    Height = processed.Height,
                    CreatedAt = now,
                    UpdatedAt = now,
                });
            }

            db.ListingPhotos.AddRange(rows);
            await db.SaveChangesAsync(ct);
        }
        catch (InvalidPhotoException ex)
        {
            await CleanupAsync();
            return BadRequest(new { error = ex.Message });
        }
        catch (ImageFormatException)
        {
            await CleanupAsync();
            return BadRequest(new { error = "unsupported or corrupted image" });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "photo upload failed for listing {ListingId}", id);
            await CleanupAsync();
            throw;
        }

        return Ok(rows.Select(p => new
        {
            id = p.Id,
            url = storage.GetPublicUrl(p.Url),
            thumbUrl = p.ThumbUrl == null ? null : storage.GetPublicUrl(p.ThumbUrl),
            sortOrder = (int)p.SortOrder,
            width = p.Width,
            height = p.Height,
        }));

        async Task CleanupAsync()
        {
            foreach (var key in written)
            {
                try { await storage.DeleteAsync(key, CancellationToken.None); }
                catch (Exception ex) { logger.LogWarning(ex, "cleanup delete failed: {Key}", key); }
            }
        }
    }

    [HttpDelete("{photoId:guid}")]
    public async Task<IActionResult> Delete(Guid id, Guid photoId, [FromQuery] Guid? userId, CancellationToken ct)
    {
        if (userId is null) return BadRequest(new { error = "userId required" });

        var listing = await db.Listings
            .Where(l => l.Id == id && l.DeletedAt == null)
            .Select(l => new { l.Id, l.SellerId })
            .FirstOrDefaultAsync(ct);
        if (listing is null) return NotFound(new { error = "listing not found" });
        if (listing.SellerId != userId.Value) return StatusCode(403);

        var photo = await db.ListingPhotos.FirstOrDefaultAsync(p => p.Id == photoId && p.ListingId == id, ct);
        if (photo is null) return NoContent();

        db.ListingPhotos.Remove(photo);
        await db.SaveChangesAsync(ct);

        try { await storage.DeleteAsync(photo.Url, ct); } catch { /* janitor reclaims */ }
        if (!string.IsNullOrEmpty(photo.ThumbUrl))
        {
            try { await storage.DeleteAsync(photo.ThumbUrl, ct); } catch { /* janitor reclaims */ }
        }

        return NoContent();
    }

    [HttpPatch]
    public async Task<IActionResult> Reorder(Guid id, [FromQuery] Guid? userId, [FromBody] ReorderPhotosRequest req, CancellationToken ct)
    {
        if (userId is null) return BadRequest(new { error = "userId required" });
        if (req.Order is null || req.Order.Count == 0)
            return BadRequest(new { error = "order required" });

        var listing = await db.Listings
            .Where(l => l.Id == id && l.DeletedAt == null)
            .Select(l => new { l.Id, l.SellerId })
            .FirstOrDefaultAsync(ct);
        if (listing is null) return NotFound(new { error = "listing not found" });
        if (listing.SellerId != userId.Value) return StatusCode(403);

        var photos = await db.ListingPhotos.Where(p => p.ListingId == id).ToListAsync(ct);
        var byId = photos.ToDictionary(p => p.Id);
        foreach (var entry in req.Order)
        {
            if (!byId.ContainsKey(entry.PhotoId))
                return BadRequest(new { error = $"photo {entry.PhotoId} not on this listing" });
        }

        await using var tx = await db.Database.BeginTransactionAsync(ct);
        foreach (var p in photos)
        {
            p.SortOrder = (short)(p.SortOrder + 100);
        }
        await db.SaveChangesAsync(ct);

        foreach (var entry in req.Order)
        {
            var p = byId[entry.PhotoId];
            p.SortOrder = (short)entry.SortOrder;
            p.UpdatedAt = DateTime.UtcNow;
        }
        await db.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);

        return NoContent();
    }
}
