using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;

namespace Souq.Api.Storage;

public sealed class PhotoProcessor
{
    public const int MaxInputDimension = 8000;
    public const long MaxInputBytes = 10L * 1024 * 1024;
    public const int DisplayLongEdge = 2048;
    public const int ThumbLongEdge = 400;
    public const int DisplayQuality = 82;
    public const int ThumbQuality = 75;

    public static readonly HashSet<string> AcceptedMimes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg", "image/png", "image/webp"
    };

    public sealed record Result(int Width, int Height, byte[] DisplayJpeg, byte[] ThumbJpeg);

    public async Task<Result> ProcessAsync(Stream input, CancellationToken ct = default)
    {
        using var image = await Image.LoadAsync(input, ct);

        if (image.Width > MaxInputDimension || image.Height > MaxInputDimension)
            throw new InvalidPhotoException($"image too large (max {MaxInputDimension}px on either edge)");

        image.Mutate(c => c.AutoOrient());
        StripMetadata(image);

        var origWidth = image.Width;
        var origHeight = image.Height;

        var display = await EncodeJpegAsync(image, DisplayLongEdge, DisplayQuality, ct);
        var thumb = await EncodeJpegAsync(image, ThumbLongEdge, ThumbQuality, ct);

        return new Result(origWidth, origHeight, display, thumb);
    }

    private static async Task<byte[]> EncodeJpegAsync(Image source, int longEdge, int quality, CancellationToken ct)
    {
        using var clone = source.Clone(c => Resize(c, longEdge));
        var encoder = new JpegEncoder { Quality = quality };
        using var ms = new MemoryStream();
        await clone.SaveAsync(ms, encoder, ct);
        return ms.ToArray();
    }

    private static IImageProcessingContext Resize(IImageProcessingContext ctx, int longEdge)
    {
        var size = ctx.GetCurrentSize();
        if (size.Width <= longEdge && size.Height <= longEdge) return ctx;
        return ctx.Resize(new ResizeOptions
        {
            Mode = ResizeMode.Max,
            Size = new Size(longEdge, longEdge),
            Sampler = KnownResamplers.Lanczos3,
        });
    }

    private static void StripMetadata(Image image)
    {
        image.Metadata.ExifProfile = null;
        image.Metadata.IptcProfile = null;
        image.Metadata.XmpProfile = null;
        image.Metadata.IccProfile = null;
    }
}

public sealed class InvalidPhotoException(string message) : Exception(message);
