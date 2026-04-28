using Microsoft.Extensions.Options;

namespace Souq.Api.Storage;

public sealed class LocalDiskStorage : IObjectStorage
{
    private readonly string _root;

    public LocalDiskStorage(IOptions<StorageOptions> options, IHostEnvironment env)
    {
        var configured = options.Value.Local.RootPath;
        _root = Path.IsPathRooted(configured)
            ? configured
            : Path.GetFullPath(Path.Combine(env.ContentRootPath, configured));
        Directory.CreateDirectory(_root);
    }

    public string Root => _root;

    public string GetPublicUrl(string key) => "/uploads/" + key.Replace('\\', '/');

    public async Task PutAsync(string key, Stream content, string contentType, CancellationToken ct = default)
    {
        var path = ResolveSafe(key);
        Directory.CreateDirectory(Path.GetDirectoryName(path)!);
        await using var fs = new FileStream(path, FileMode.Create, FileAccess.Write, FileShare.None);
        await content.CopyToAsync(fs, ct);
    }

    public Task<Stream?> OpenReadAsync(string key, CancellationToken ct = default)
    {
        var path = ResolveSafe(key);
        if (!File.Exists(path)) return Task.FromResult<Stream?>(null);
        Stream s = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read);
        return Task.FromResult<Stream?>(s);
    }

    public Task DeleteAsync(string key, CancellationToken ct = default)
    {
        var path = ResolveSafe(key);
        if (File.Exists(path)) File.Delete(path);
        return Task.CompletedTask;
    }

    public Task DeletePrefixAsync(string keyPrefix, CancellationToken ct = default)
    {
        var path = ResolveSafe(keyPrefix);
        if (Directory.Exists(path)) Directory.Delete(path, recursive: true);
        return Task.CompletedTask;
    }

    public async IAsyncEnumerable<string> ListKeysAsync(
        string keyPrefix,
        [System.Runtime.CompilerServices.EnumeratorCancellation] CancellationToken ct = default)
    {
        var path = ResolveSafe(keyPrefix);
        if (!Directory.Exists(path)) yield break;
        foreach (var file in Directory.EnumerateFiles(path, "*", SearchOption.AllDirectories))
        {
            ct.ThrowIfCancellationRequested();
            var rel = Path.GetRelativePath(_root, file).Replace(Path.DirectorySeparatorChar, '/');
            yield return rel;
            await Task.Yield();
        }
    }

    private string ResolveSafe(string key)
    {
        if (string.IsNullOrWhiteSpace(key)) throw new ArgumentException("key required", nameof(key));
        if (key.Contains("..")) throw new ArgumentException("invalid key", nameof(key));
        var path = Path.GetFullPath(Path.Combine(_root, key));
        if (!path.StartsWith(_root + Path.DirectorySeparatorChar, StringComparison.Ordinal) && path != _root)
            throw new ArgumentException("key escapes storage root", nameof(key));
        return path;
    }
}
