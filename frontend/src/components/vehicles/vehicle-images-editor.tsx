"use client";

import * as React from "react";
import type { VehicleImage } from "@/services/vehicles/queries";

type VehicleImagesEditorProps = {
  images?: VehicleImage[];
  onUpload: (file: File) => void;
  onRemove: (imageId: number) => void;
  disabled?: boolean;
  pendingPreviewUrl?: string;
  onClearPending?: () => void;
};

export function VehicleImagesEditor({
  images = [],
  onUpload,
  onRemove,
  disabled = false,
  pendingPreviewUrl,
  onClearPending,
}: VehicleImagesEditorProps) {
  const [index, setIndex] = React.useState(0);
  const hasMultiple = images.length > 1;
  const image = images[index];
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
  const imageUrl =
    image && image.relativePath.startsWith("http")
      ? image.relativePath
      : image
        ? `${apiBaseUrl}/${image.relativePath}`
        : "";

  React.useEffect(() => {
    setIndex(0);
  }, [images.length]);

  const hasPending = Boolean(pendingPreviewUrl) && !image;

  return (
    <div className="space-y-3">
      <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/30">
        {image ? (
          <>
            <img
              src={imageUrl}
              alt="Vehicle"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              className="absolute right-3 top-3 rounded-full bg-background/90 px-2 text-xs shadow"
              disabled={disabled}
              onClick={() => onRemove(image.id)}
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
          <span className="text-sm text-muted-foreground">No images</span>
        )}
        {hasMultiple && (
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-between px-3">
            <button
              type="button"
              className="rounded-full bg-background/80 px-3 py-1 text-xs shadow"
              disabled={disabled}
              onClick={() =>
                setIndex((prev) => (prev - 1 + images.length) % images.length)
              }
            >
              Prev
            </button>
            <button
              type="button"
              className="rounded-full bg-background/80 px-3 py-1 text-xs shadow"
              disabled={disabled}
              onClick={() => setIndex((prev) => (prev + 1) % images.length)}
            >
              Next
            </button>
          </div>
        )}
      </div>
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
