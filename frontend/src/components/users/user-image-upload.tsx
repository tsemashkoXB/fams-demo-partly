"use client";

import type { UserImage } from "@/services/users";

type UserImageUploadProps = {
  images?: UserImage[];
  onUpload: (file: File) => void;
  onRemove: (imageId: number) => void;
  disabled?: boolean;
  pendingPreviewUrl?: string;
  onClearPending?: () => void;
};

function getPrimaryImage(images?: UserImage[]): UserImage | null {
  if (!images || images.length === 0) {
    return null;
  }
  return images.reduce((primary, image) =>
    image.displayOrder > primary.displayOrder ? image : primary
  );
}

export function UserImageUpload({
  images = [],
  onUpload,
  onRemove,
  disabled = false,
  pendingPreviewUrl,
  onClearPending,
}: UserImageUploadProps) {
  const primaryImage = getPrimaryImage(images);
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
  const imageUrl = primaryImage
    ? primaryImage.relativePath.startsWith("http")
      ? primaryImage.relativePath
      : `${apiBaseUrl}/${primaryImage.relativePath}`
    : "";

  const hasPending = Boolean(pendingPreviewUrl) && !primaryImage;

  return (
    <div className="space-y-3">
      <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/30">
        {primaryImage ? (
          <>
            <img
              src={imageUrl}
              alt="User"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              className="absolute right-3 top-3 rounded-full bg-background/90 px-2 text-xs shadow"
              disabled={disabled}
              onClick={() => onRemove(primaryImage.id)}
            >
              ✕
            </button>
          </>
        ) : hasPending ? (
          <>
            <img
              src={pendingPreviewUrl}
              alt="Pending upload"
              className="h-full w-full object-cover"
            />
            {onClearPending && (
              <button
                type="button"
                className="absolute right-3 top-3 rounded-full bg-background/90 px-2 text-xs shadow"
                disabled={disabled}
                onClick={onClearPending}
              >
                ✕
              </button>
            )}
            <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2 py-1 text-xs text-muted-foreground shadow">
              Pending
            </span>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">No image</span>
        )}
      </div>
      {images.length > 1 && (
        <p className="text-xs text-muted-foreground">
          {images.length} images available
        </p>
      )}
      <label
        className={`inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground ${
          disabled
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer hover:bg-muted/40"
        }`}
      >
        <input
          type="file"
          className="hidden"
          accept="image/*"
          disabled={disabled}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              onUpload(file);
            }
            event.target.value = "";
          }}
        />
        Upload photo
      </label>
    </div>
  );
}
