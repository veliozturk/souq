using System.Text.RegularExpressions;

namespace Souq.Api.Features.Auth;

internal static class PhoneNormalizer
{
    public static string Normalize(string? input) => Regex.Replace(input ?? "", @"\D", "");
}
