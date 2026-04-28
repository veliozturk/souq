using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Souq.Api.Persistence;

namespace Souq.Api.Features.Catalog;

[ApiController]
[Route("api")]
public sealed class CatalogController(SouqDbContext db) : ControllerBase
{
    [HttpGet("categories")]
    public async Task<IActionResult> Categories()
    {
        var rows = await db.Categories
            .AsNoTracking()
            .Where(c => c.IsActive == 1)
            .OrderBy(c => c.SortOrder)
            .Select(c => new
            {
                id = c.Id,
                slug = c.Slug,
                name = c.Name,
                iconName = c.IconName,
                parentId = c.ParentId,
                sortOrder = c.SortOrder,
            })
            .ToListAsync();
        return Ok(rows);
    }

    [HttpGet("conditions")]
    public async Task<IActionResult> Conditions()
    {
        var rows = await db.Conditions
            .AsNoTracking()
            .Where(c => c.IsActive == 1)
            .OrderBy(c => c.SortOrder)
            .Select(c => new { id = c.Id, slug = c.Slug, name = c.Name, sortOrder = c.SortOrder })
            .ToListAsync();
        return Ok(rows);
    }

    [HttpGet("neighborhoods")]
    public async Task<IActionResult> Neighborhoods()
    {
        var rows = await db.Neighborhoods
            .AsNoTracking()
            .Where(n => n.IsActive == 1)
            .OrderBy(n => n.SortOrder)
            .Select(n => new
            {
                id = n.Id,
                slug = n.Slug,
                name = n.Name,
                centerLat = n.CenterLat,
                centerLng = n.CenterLng,
            })
            .ToListAsync();
        return Ok(rows);
    }

    [HttpGet("quick-replies")]
    public IActionResult QuickReplies() => Ok(new[]
    {
        new { id = "qr_available", text = new { en = "Is this still available?",        ar = "هل لا يزال متاحًا؟" },        sortOrder = 1 },
        new { id = "qr_more_pics", text = new { en = "Can I see more photos?",          ar = "هل يمكنني رؤية صور إضافية؟" }, sortOrder = 2 },
        new { id = "qr_lower",     text = new { en = "Would you accept a lower offer?", ar = "هل تقبل عرضًا أقل؟" },         sortOrder = 3 },
        new { id = "qr_pickup",    text = new { en = "Can I pick up today?",            ar = "هل يمكنني الاستلام اليوم؟" },   sortOrder = 4 },
        new { id = "qr_delivery",  text = new { en = "Is delivery possible?",           ar = "هل التوصيل متاح؟" },           sortOrder = 5 },
    });

    [HttpGet("config")]
    public IActionResult Config() => Ok(new { welcomeCreditAed = 50 });
}
