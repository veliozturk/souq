using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Souq.Api.Domain;
using Souq.Api.Features.Users;
using Souq.Api.Persistence;

namespace Souq.Api.Features.Auth;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(SouqDbContext db, UsersService users) : ControllerBase
{
    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest req)
    {
        var digits = PhoneNormalizer.Normalize(req.Phone);
        if (digits.Length == 0) return BadRequest(new { error = "phone required" });

        var user = await db.Users
            .AsNoTracking()
            .Include(u => u.HomeNeighborhood)
            .FirstOrDefaultAsync(u => u.Phone == digits && u.DeletedAt == null);

        if (user is null) return NotFound(new { error = "Phone not registered" });

        var session = new UsrSession { UserId = user.Id };
        db.Sessions.Add(session);
        await db.SaveChangesAsync();

        return Ok(new { user = await users.GetMeDtoAsync(user), sessionId = session.Id });
    }

    [HttpPost("register")]
    public IActionResult Register()
        => StatusCode(StatusCodes.Status403Forbidden, new { error = "Registration disabled" });

    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromServices] IUserContext userCtx)
    {
        if (userCtx.CurrentSessionId is null) return Unauthorized();

        var session = await db.Sessions.FirstOrDefaultAsync(s => s.Id == userCtx.CurrentSessionId.Value);
        if (session is not null && session.RevokedAt is null)
        {
            session.RevokedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();
        }
        return NoContent();
    }
}
