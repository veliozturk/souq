namespace Souq.Api.Features.Messaging;

public sealed record StartConversationRequest(Guid ListingId, Guid PeerId, Guid UserId, string Text);
public sealed record SendMessageRequest(Guid UserId, string Text);
