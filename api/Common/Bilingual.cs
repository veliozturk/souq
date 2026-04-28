using System.Text.Json.Serialization;

namespace Souq.Api.Common;

public sealed class BilingualName
{
    [JsonPropertyName("en")]
    public string En { get; set; } = "";

    [JsonPropertyName("ar")]
    public string Ar { get; set; } = "";
}

public sealed class BilingualUgcText
{
    [JsonPropertyName("original")]
    public string Original { get; set; } = "";

    [JsonPropertyName("en")]
    public string En { get; set; } = "";

    [JsonPropertyName("ar")]
    public string Ar { get; set; } = "";
}
