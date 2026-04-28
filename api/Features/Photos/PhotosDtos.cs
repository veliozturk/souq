namespace Souq.Api.Features.Photos;

public sealed record ReorderPhotoEntry(Guid PhotoId, int SortOrder);
public sealed record ReorderPhotosRequest(List<ReorderPhotoEntry> Order);
