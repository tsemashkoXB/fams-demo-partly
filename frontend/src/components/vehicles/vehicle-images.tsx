"use client";

import * as React from "react";
import type { VehicleImage } from "@/services/vehicles/queries";

type VehicleImagesProps = {
  images?: VehicleImage[];
};

export function VehicleImages({ images = [] }: VehicleImagesProps) {
  const [index, setIndex] = React.useState(0);
  const hasMultiple = images.length > 1;
  const image = images[index];
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
  const imageUrl =
    image && image.relativePath.startsWith("http")
      ? image.relativePath
      : image
        ? `${apiBaseUrl}/${image.relativePath}`
        : "";

  React.useEffect(() => {
    setIndex(0);
  }, [images.length]);

  return (
    <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/30">
      {image ? (
        <img
          src={imageUrl}
          alt="Vehicle"
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-sm text-muted-foreground">No images</span>
      )}
      {hasMultiple && (
        <div className="absolute inset-x-0 bottom-3 flex items-center justify-between px-3">
          <button
            type="button"
            className="rounded-full bg-background/80 px-3 py-1 text-xs shadow"
            onClick={() =>
              setIndex((prev) => (prev - 1 + images.length) % images.length)
            }
          >
            Prev
          </button>
          <button
            type="button"
            className="rounded-full bg-background/80 px-3 py-1 text-xs shadow"
            onClick={() => setIndex((prev) => (prev + 1) % images.length)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
