using Microsoft.EntityFrameworkCore;
using Souq.Api.Persistence;

namespace Souq.Api.Storage;

public sealed class StorageJanitor(
    IServiceScopeFactory scopeFactory,
    ILogger<StorageJanitor> logger) : BackgroundService
{
    private static readonly TimeSpan FirstRunDelay = TimeSpan.FromMinutes(2);
    private static readonly TimeSpan Interval = TimeSpan.FromHours(24);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await Task.Delay(FirstRunDelay, stoppingToken);
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await SweepOnceAsync(stoppingToken);
            }
            catch (OperationCanceledException)
            {
                return;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "StorageJanitor sweep failed");
            }
            try
            {
                await Task.Delay(Interval, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                return;
            }
        }
    }

    private async Task SweepOnceAsync(CancellationToken ct)
    {
        using var scope = scopeFactory.CreateScope();
        var storage = scope.ServiceProvider.GetRequiredService<IObjectStorage>();
        if (storage is not LocalDiskStorage local) return;

        var db = scope.ServiceProvider.GetRequiredService<SouqDbContext>();
        var keepKeys = new HashSet<string>(StringComparer.Ordinal);
        await foreach (var url in db.ListingPhotos.AsNoTracking().Select(p => p.Url).AsAsyncEnumerable().WithCancellation(ct))
        {
            if (!string.IsNullOrEmpty(url)) keepKeys.Add(url);
        }
        await foreach (var thumb in db.ListingPhotos.AsNoTracking().Select(p => p.ThumbUrl).AsAsyncEnumerable().WithCancellation(ct))
        {
            if (!string.IsNullOrEmpty(thumb)) keepKeys.Add(thumb!);
        }

        var deleted = 0;
        await foreach (var key in storage.ListKeysAsync("listings", ct))
        {
            if (keepKeys.Contains(key)) continue;
            try
            {
                await storage.DeleteAsync(key, ct);
                deleted++;
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Failed to delete orphan key {Key}", key);
            }
        }

        if (deleted > 0)
        {
            logger.LogInformation("StorageJanitor deleted {Count} orphan files", deleted);
        }
    }
}
