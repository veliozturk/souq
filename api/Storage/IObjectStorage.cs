namespace Souq.Api.Storage;

public interface IObjectStorage
{
    Task PutAsync(string key, Stream content, string contentType, CancellationToken ct = default);
    Task<Stream?> OpenReadAsync(string key, CancellationToken ct = default);
    Task DeleteAsync(string key, CancellationToken ct = default);
    Task DeletePrefixAsync(string keyPrefix, CancellationToken ct = default);
    string GetPublicUrl(string key);
    IAsyncEnumerable<string> ListKeysAsync(string keyPrefix, CancellationToken ct = default);
}
