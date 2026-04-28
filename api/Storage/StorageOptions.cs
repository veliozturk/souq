namespace Souq.Api.Storage;

public sealed class StorageOptions
{
    public string Provider { get; set; } = "Local";
    public LocalStorageOptions Local { get; set; } = new();
}

public sealed class LocalStorageOptions
{
    public string RootPath { get; set; } = "var/uploads";
}
