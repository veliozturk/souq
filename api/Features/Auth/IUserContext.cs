namespace Souq.Api.Features.Auth;

public interface IUserContext
{
    Guid? CurrentUserId { get; }
    Guid? CurrentSessionId { get; }
    void Set(Guid userId, Guid sessionId);
}

public sealed class UserContext : IUserContext
{
    public Guid? CurrentUserId { get; private set; }
    public Guid? CurrentSessionId { get; private set; }

    public void Set(Guid userId, Guid sessionId)
    {
        CurrentUserId = userId;
        CurrentSessionId = sessionId;
    }
}
