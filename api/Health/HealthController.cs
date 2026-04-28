using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace Souq.Api.Health;

[ApiController]
public sealed class HealthController : ControllerBase
{
    [HttpGet("/healthz")]
    public async Task<IActionResult> Get([FromServices] NpgsqlDataSource ds)
    {
        try
        {
            await using var conn = await ds.OpenConnectionAsync();
            await using var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT count(*) FROM pg_tables WHERE schemaname = 'souq'";
            var tables = (long)(await cmd.ExecuteScalarAsync() ?? 0L);
            return Ok(new { status = "ok", db = "ok", tables });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable,
                new { status = "degraded", db = ex.Message });
        }
    }
}
