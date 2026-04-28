namespace Souq.Api.Features.Auth;

public sealed record VerifyOtpRequest(string Phone, string Code);
