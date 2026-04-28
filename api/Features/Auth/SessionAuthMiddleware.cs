using Microsoft.EntityFrameworkCore;
using Souq.Api.Persistence;

namespace Souq.Api.Features.Auth;

public sealed class SessionAuthMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext ctx, SouqDbContext db, IUserContext userCtx)
    {
        var auth = ctx.Request.Headers.Authorization.ToString();
        const string scheme = "Session ";
        if (auth.StartsWith(scheme, StringComparison.OrdinalIgnoreCase)
            && Guid.TryParse(auth[scheme.Length..].Trim(), out var sessionId))
        {
            var session = await db.Sessions
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == sessionId && s.RevokedAt == null);
            if (session is not null)
            {
                userCtx.Set(session.UserId, session.Id);
            }
        }
        await next(ctx);
    }
}
