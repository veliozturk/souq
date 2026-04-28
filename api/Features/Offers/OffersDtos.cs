namespace Souq.Api.Features.Offers;

public sealed record MakeOfferRequest(Guid UserId, Guid PeerId, decimal AmountAed);
public sealed record CounterOfferRequest(Guid UserId, decimal AmountAed);
public sealed record DecideOfferRequest(Guid UserId, string Decision);
