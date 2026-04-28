using Microsoft.AspNetCore.Mvc;
using Souq.Api.Storage;

namespace Souq.Api.Health;

[ApiController]
public sealed class UploadsController : ControllerBase
{
    [HttpGet("/uploads/{*path}")]
    public async Task<IActionResult> Get(string path, [FromServices] IObjectStorage storage, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(path) || path.Contains("..")) return NotFound();

        var ext = Path.GetExtension(path).ToLowerInvariant();
        var contentType = ext switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".webp" => "image/webp",
            _ => null,
        };
        if (contentType is null) return NotFound();

        var stream = await storage.OpenReadAsync(path, ct);
        if (stream is null) return NotFound();
        return File(stream, contentType, enableRangeProcessing: true);
    }
}
