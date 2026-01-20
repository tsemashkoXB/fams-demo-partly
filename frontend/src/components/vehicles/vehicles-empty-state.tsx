"use client";

export function VehiclesEmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
      No vehicles found. Try adjusting your search or add a new vehicle.
    </div>
  );
}
