using System.Diagnostics;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Souq.Api.Persistence;

namespace Souq.Api.Features.Voice;

[ApiController]
[Route("api/voice")]
public sealed class VoiceController(
    IHttpClientFactory httpFactory,
    IConfiguration cfg,
    ILogger<VoiceController> log,
    SouqDbContext db) : ControllerBase
{
    private const string AnthropicUrl = "https://api.anthropic.com/v1/messages";
    private const string AnthropicVersion = "2023-06-01";
    private const string Model = "claude-haiku-4-5-20251001";
    private const int MaxTranscriptChars = 4000;
    private const int RequestTimeoutSeconds = 20;

    private const string WhisperUrl = "https://api.openai.com/v1/audio/transcriptions";
    private const string WhisperModel = "whisper-1";
    private const int TranscribeTimeoutSeconds = 30;

    private static readonly string[] Tones = ["Honest", "Warm", "Concise"];

    private const string SystemPrompt =
        "You rewrite a seller's voice note into three Dubai marketplace listings with different tones. " +
        "Tones: Honest (straightforward, includes flaws naturally), Warm (friendly, emphasizes good qualities), " +
        "Concise (short, punchy, just the facts). Each rewrite has a `title` (≤ 60 chars, sentence case, " +
        "no emojis) and a `body` (2–3 sentences, ≤ 240 chars). Always write the title and body in English, regardless of the language of the transcript — translate from Arabic or any other language if needed. " +
        "Output ONLY this JSON, no preamble or code fences: " +
        "{\"suggestions\":[{\"tone\":\"Honest\",\"title\":\"...\",\"body\":\"...\"}," +
        "{\"tone\":\"Warm\",\"title\":\"...\",\"body\":\"...\"}," +
        "{\"tone\":\"Concise\",\"title\":\"...\",\"body\":\"...\"}]}.";

    public sealed record SuggestRequest(string? Transcript);
    public sealed record VoiceSuggestion(string Tone, string Title, string Body);
    public sealed record SuggestResponse(VoiceSuggestion[] Suggestions);
    public sealed record TranscribeResponse(string Transcript);
    public sealed record ClassifyRequest(string? Transcript);
    public sealed record ClassifyResponse(string? CategorySlug, string? ConditionSlug, int? PriceAed);

    [HttpPost("transcribe")]
    [RequestSizeLimit(26_214_400)]
    [EnableRateLimiting("uploads")]
    public async Task<IActionResult> Transcribe(IFormFile? file, CancellationToken ct)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { error = "audio_empty" });

        var apiKey = cfg["OpenAI:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            log.LogWarning("OpenAI:ApiKey is not configured; voice transcription unavailable");
            return StatusCode(503, new { error = "voice_unconfigured" });
        }

        using var timeoutCts = CancellationTokenSource.CreateLinkedTokenSource(ct);
        timeoutCts.CancelAfter(TimeSpan.FromSeconds(TranscribeTimeoutSeconds));

        await using var audioStream = file.OpenReadStream();
        using var form = new MultipartFormDataContent();

        var fileContent = new StreamContent(audioStream);
        fileContent.Headers.ContentType = new MediaTypeHeaderValue(
            string.IsNullOrWhiteSpace(file.ContentType) ? "audio/m4a" : file.ContentType);
        form.Add(fileContent, "file",
            string.IsNullOrWhiteSpace(file.FileName) ? "recording.m4a" : file.FileName);
        form.Add(new StringContent(WhisperModel), "model");
        form.Add(new StringContent("json"), "response_format");

        using var request = new HttpRequestMessage(HttpMethod.Post, WhisperUrl) { Content = form };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        var http = httpFactory.CreateClient();
        var stopwatch = Stopwatch.StartNew();
        HttpResponseMessage res;
        try
        {
            res = await http.SendAsync(request, timeoutCts.Token);
        }
        catch (OperationCanceledException) when (!ct.IsCancellationRequested)
        {
            log.LogWarning("Whisper call timed out after {Seconds}s", TranscribeTimeoutSeconds);
            return StatusCode(504, new { error = "voice_timeout" });
        }
        catch (HttpRequestException ex)
        {
            log.LogWarning(ex, "Whisper HTTP error");
            return StatusCode(502, new { error = "voice_upstream_error" });
        }
        stopwatch.Stop();

        var body = await res.Content.ReadAsStringAsync(ct);
        if (!res.IsSuccessStatusCode)
        {
            log.LogWarning(
                "Whisper returned {Status} in {Ms}ms: {Body}",
                (int)res.StatusCode, stopwatch.ElapsedMilliseconds, Truncate(body, 500));
            return StatusCode(502, new { error = "voice_upstream_error" });
        }

        WhisperResponse? envelope;
        try
        {
            envelope = JsonSerializer.Deserialize<WhisperResponse>(body, JsonOpts);
        }
        catch (JsonException ex)
        {
            log.LogWarning(ex, "Failed to parse Whisper envelope: {Body}", Truncate(body, 500));
            return StatusCode(502, new { error = "voice_invalid_response" });
        }

        var text = envelope?.Text?.Trim() ?? "";
        log.LogInformation(
            "Voice transcription OK in {Ms}ms ({Bytes} bytes audio, {Chars} chars out)",
            stopwatch.ElapsedMilliseconds, file.Length, text.Length);

        return Ok(new TranscribeResponse(text));
    }

    [HttpPost("suggestions")]
    public async Task<IActionResult> Suggest([FromBody] SuggestRequest req, CancellationToken ct)
    {
        var transcript = req.Transcript?.Trim() ?? "";
        if (transcript.Length == 0)
            return BadRequest(new { error = "transcript_empty" });
        if (transcript.Length > MaxTranscriptChars)
            return BadRequest(new { error = "transcript_too_long" });

        var apiKey = cfg["Anthropic:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            log.LogWarning("Anthropic:ApiKey is not configured; voice suggestions unavailable");
            return StatusCode(503, new { error = "voice_unconfigured" });
        }

        using var timeoutCts = CancellationTokenSource.CreateLinkedTokenSource(ct);
        timeoutCts.CancelAfter(TimeSpan.FromSeconds(RequestTimeoutSeconds));

        var http = httpFactory.CreateClient();
        var request = new HttpRequestMessage(HttpMethod.Post, AnthropicUrl)
        {
            Content = JsonContent.Create(new
            {
                model = Model,
                max_tokens = 600,
                temperature = 0.8,
                system = SystemPrompt,
                messages = new object[]
                {
                    new { role = "user", content = transcript },
                },
            }),
        };
        request.Headers.TryAddWithoutValidation("x-api-key", apiKey);
        request.Headers.TryAddWithoutValidation("anthropic-version", AnthropicVersion);
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        var stopwatch = Stopwatch.StartNew();
        HttpResponseMessage res;
        try
        {
            res = await http.SendAsync(request, timeoutCts.Token);
        }
        catch (OperationCanceledException) when (!ct.IsCancellationRequested)
        {
            log.LogWarning("Anthropic call timed out after {Seconds}s", RequestTimeoutSeconds);
            return StatusCode(504, new { error = "voice_timeout" });
        }
        catch (HttpRequestException ex)
        {
            log.LogWarning(ex, "Anthropic HTTP error");
            return StatusCode(502, new { error = "voice_upstream_error" });
        }
        stopwatch.Stop();

        var body = await res.Content.ReadAsStringAsync(ct);
        if (!res.IsSuccessStatusCode)
        {
            log.LogWarning(
                "Anthropic returned {Status} in {Ms}ms: {Body}",
                (int)res.StatusCode, stopwatch.ElapsedMilliseconds, Truncate(body, 500));
            return StatusCode(502, new { error = "voice_upstream_error" });
        }

        AnthropicResponse? envelope;
        try
        {
            envelope = JsonSerializer.Deserialize<AnthropicResponse>(body);
        }
        catch (JsonException ex)
        {
            log.LogWarning(ex, "Failed to parse Anthropic envelope: {Body}", Truncate(body, 500));
            return StatusCode(502, new { error = "voice_invalid_response" });
        }

        var text = envelope?.Content?.FirstOrDefault(c => c.Type == "text")?.Text;
        if (string.IsNullOrWhiteSpace(text))
        {
            log.LogWarning("Anthropic returned no text content: {Body}", Truncate(body, 500));
            return StatusCode(502, new { error = "voice_invalid_response" });
        }

        var json = ExtractJsonObject(text);
        if (json is null)
        {
            log.LogWarning("Could not locate JSON object in Haiku output: {Text}", Truncate(text, 500));
            return StatusCode(502, new { error = "voice_invalid_response" });
        }

        ParsedPayload? parsed;
        try
        {
            parsed = JsonSerializer.Deserialize<ParsedPayload>(json, JsonOpts);
        }
        catch (JsonException ex)
        {
            log.LogWarning(ex, "Failed to parse Haiku JSON: {Json}", Truncate(json, 500));
            return StatusCode(502, new { error = "voice_invalid_response" });
        }

        var suggestions = NormalizeSuggestions(parsed?.Suggestions);
        if (suggestions is null)
        {
            log.LogWarning("Haiku JSON had wrong shape: {Json}", Truncate(json, 500));
            return StatusCode(502, new { error = "voice_invalid_response" });
        }

        log.LogInformation(
            "Voice suggestions OK in {Ms}ms (input {InTokens}, output {OutTokens})",
            stopwatch.ElapsedMilliseconds,
            envelope?.Usage?.InputTokens ?? -1,
            envelope?.Usage?.OutputTokens ?? -1);

        return Ok(new SuggestResponse(suggestions));
    }

    [HttpPost("classify")]
    public async Task<IActionResult> Classify([FromBody] ClassifyRequest req, CancellationToken ct)
    {
        var transcript = req.Transcript?.Trim() ?? "";
        if (transcript.Length == 0)
            return BadRequest(new { error = "transcript_empty" });
        if (transcript.Length > MaxTranscriptChars)
            return BadRequest(new { error = "transcript_too_long" });

        var apiKey = cfg["Anthropic:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            log.LogWarning("Anthropic:ApiKey is not configured; voice classify unavailable");
            return StatusCode(503, new { error = "voice_unconfigured" });
        }

        var cats = await db.Categories.AsNoTracking()
            .Where(c => c.IsActive == 1).OrderBy(c => c.SortOrder)
            .Select(c => new { c.Slug, NameEn = c.Name.En })
            .ToListAsync(ct);
        var conds = await db.Conditions.AsNoTracking()
            .Where(c => c.IsActive == 1).OrderBy(c => c.SortOrder)
            .Select(c => new { c.Slug, NameEn = c.Name.En })
            .ToListAsync(ct);
        var catSlugs = cats.Select(c => c.Slug).ToHashSet();
        var condSlugs = conds.Select(c => c.Slug).ToHashSet();

        var promptBuilder = new StringBuilder();
        promptBuilder.Append("You extract category, condition, and asking price from a Dubai marketplace voice note. ");
        promptBuilder.Append("Categories (slug — English name): ");
        promptBuilder.Append(string.Join(", ", cats.Select(c => $"{c.Slug} — {c.NameEn}")));
        promptBuilder.Append(". Conditions (slug — English name): ");
        promptBuilder.Append(string.Join(", ", conds.Select(c => $"{c.Slug} — {c.NameEn}")));
        promptBuilder.Append(". Rules: pick exactly one category slug and one condition slug from the lists, or null if unclear. ");
        promptBuilder.Append("Transcript may be Arabic/English/Turkish/mixed. ");
        promptBuilder.Append("`priceAed` is a whole number of UAE dirhams (AED) the seller is asking for. ");
        promptBuilder.Append("If the transcript names a specific number — even softened with 'around', 'maybe', 'roughly', 'civarında', 'olabilir', 'düşünüyorum', 'حوالي' — extract that number. ");
        promptBuilder.Append("Accept '200 dirhams', '200 AED', 'two hundred', '٢٠٠ درهم'. ");
        promptBuilder.Append("Return null only if there is no specific number, or if the price is purely qualitative ('negotiable', 'best offer', 'open to offers'). ");
        promptBuilder.Append("Do not guess from product type. ");
        promptBuilder.Append("Output ONLY this JSON, no preamble or code fences: ");
        promptBuilder.Append("{\"category\":\"<slug-or-null>\",\"condition\":\"<slug-or-null>\",\"priceAed\":<integer-or-null>}.");

        using var timeoutCts = CancellationTokenSource.CreateLinkedTokenSource(ct);
        timeoutCts.CancelAfter(TimeSpan.FromSeconds(RequestTimeoutSeconds));

        var http = httpFactory.CreateClient();
        var request = new HttpRequestMessage(HttpMethod.Post, AnthropicUrl)
        {
            Content = JsonContent.Create(new
            {
                model = Model,
                max_tokens = 80,
                temperature = 0.0,
                system = promptBuilder.ToString(),
                messages = new object[]
                {
                    new { role = "user", content = transcript },
                },
            }),
        };
        request.Headers.TryAddWithoutValidation("x-api-key", apiKey);
        request.Headers.TryAddWithoutValidation("anthropic-version", AnthropicVersion);
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        var stopwatch = Stopwatch.StartNew();
        try
        {
            var res = await http.SendAsync(request, timeoutCts.Token);
            stopwatch.Stop();
            var body = await res.Content.ReadAsStringAsync(ct);
            if (!res.IsSuccessStatusCode)
            {
                log.LogWarning(
                    "Anthropic classify returned {Status} in {Ms}ms: {Body}",
                    (int)res.StatusCode, stopwatch.ElapsedMilliseconds, Truncate(body, 500));
                return Ok(new ClassifyResponse(null, null, null));
            }

            var envelope = JsonSerializer.Deserialize<AnthropicResponse>(body);
            var text = envelope?.Content?.FirstOrDefault(c => c.Type == "text")?.Text;
            if (string.IsNullOrWhiteSpace(text))
            {
                log.LogWarning("Anthropic classify returned no text content: {Body}", Truncate(body, 500));
                return Ok(new ClassifyResponse(null, null, null));
            }

            var json = ExtractJsonObject(text);
            if (json is null)
            {
                log.LogWarning("Could not locate JSON object in Haiku classify output: {Text}", Truncate(text, 500));
                return Ok(new ClassifyResponse(null, null, null));
            }

            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            string? cat = root.TryGetProperty("category", out var cEl) && cEl.ValueKind == JsonValueKind.String
                ? cEl.GetString() : null;
            string? cond = root.TryGetProperty("condition", out var dEl) && dEl.ValueKind == JsonValueKind.String
                ? dEl.GetString() : null;
            int? price = null;
            if (root.TryGetProperty("priceAed", out var pEl) && pEl.ValueKind == JsonValueKind.Number)
            {
                if (pEl.TryGetInt32(out var pi)) price = pi;
                else if (pEl.TryGetDouble(out var pd) && pd > 0 && pd <= 10_000_000) price = (int)pd;
            }

            if (cat is not null && !catSlugs.Contains(cat)) cat = null;
            if (cond is not null && !condSlugs.Contains(cond)) cond = null;
            if (price is not null && (price <= 0 || price > 10_000_000)) price = null;

            log.LogInformation(
                "Voice classify OK in {Ms}ms (input {InTokens}, output {OutTokens}) -> cat={Cat} cond={Cond} price={Price}",
                stopwatch.ElapsedMilliseconds,
                envelope?.Usage?.InputTokens ?? -1,
                envelope?.Usage?.OutputTokens ?? -1,
                cat ?? "null", cond ?? "null", price?.ToString() ?? "null");

            return Ok(new ClassifyResponse(cat, cond, price));
        }
        catch (OperationCanceledException) when (!ct.IsCancellationRequested)
        {
            log.LogWarning("Anthropic classify timed out after {Seconds}s", RequestTimeoutSeconds);
            return Ok(new ClassifyResponse(null, null, null));
        }
        catch (HttpRequestException ex)
        {
            log.LogWarning(ex, "Anthropic classify HTTP error");
            return Ok(new ClassifyResponse(null, null, null));
        }
        catch (JsonException ex)
        {
            log.LogWarning(ex, "Anthropic classify JSON parse error");
            return Ok(new ClassifyResponse(null, null, null));
        }
    }

    private static VoiceSuggestion[]? NormalizeSuggestions(ParsedSuggestion[]? raw)
    {
        if (raw is null || raw.Length != 3) return null;
        var result = new VoiceSuggestion[3];
        for (var i = 0; i < 3; i++)
        {
            var s = raw[i];
            if (string.IsNullOrWhiteSpace(s.Title) || string.IsNullOrWhiteSpace(s.Body)) return null;
            var canonical = Tones.FirstOrDefault(t =>
                string.Equals(t, s.Tone?.Trim(), StringComparison.OrdinalIgnoreCase));
            if (canonical is null) return null;
            result[i] = new VoiceSuggestion(canonical, s.Title.Trim(), s.Body.Trim());
        }
        return result;
    }

    private static string? ExtractJsonObject(string text)
    {
        var start = text.IndexOf('{');
        if (start < 0) return null;
        var depth = 0;
        var inString = false;
        var escape = false;
        for (var i = start; i < text.Length; i++)
        {
            var c = text[i];
            if (escape) { escape = false; continue; }
            if (c == '\\') { escape = true; continue; }
            if (c == '"') { inString = !inString; continue; }
            if (inString) continue;
            if (c == '{') depth++;
            else if (c == '}')
            {
                depth--;
                if (depth == 0) return text.Substring(start, i - start + 1);
            }
        }
        return null;
    }

    private static string Truncate(string s, int max) =>
        s.Length <= max ? s : s.Substring(0, max) + "…";

    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
    };

    private sealed record AnthropicResponse(
        [property: JsonPropertyName("content")] AnthropicContent[]? Content,
        [property: JsonPropertyName("usage")] AnthropicUsage? Usage);

    private sealed record AnthropicContent(
        [property: JsonPropertyName("type")] string? Type,
        [property: JsonPropertyName("text")] string? Text);

    private sealed record AnthropicUsage(
        [property: JsonPropertyName("input_tokens")] int InputTokens,
        [property: JsonPropertyName("output_tokens")] int OutputTokens);

    private sealed record ParsedPayload(ParsedSuggestion[]? Suggestions);
    private sealed record ParsedSuggestion(string? Tone, string? Title, string? Body);

    private sealed record WhisperResponse(
        [property: JsonPropertyName("text")] string? Text);
}
