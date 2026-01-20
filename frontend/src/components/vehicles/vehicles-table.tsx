"use client";

import * as React from "react";
import type { Vehicle } from "@/services/vehicles/queries";

type VehiclesTableProps = {
  vehicles: Vehicle[];
  selectedId: number | null;
  onSelect: (vehicleId: number) => void;
  disabled?: boolean;
};

export function VehiclesTable({
  vehicles,
  selectedId,
  onSelect,
  disabled = false,
}: VehiclesTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 text-left">Plate</th>
            <th className="px-4 py-3 text-left">Model</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Year</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => {
            const isSelected = vehicle.id === selectedId;
            return (
              <tr
                key={vehicle.id}
                className={`cursor-pointer border-t border-border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isSelected ? "bg-accent/40" : "hover:bg-muted/60"
                } ${disabled ? "pointer-events-none opacity-60" : ""}`}
                onClick={() => onSelect(vehicle.id)}
                tabIndex={disabled ? -1 : 0}
                role="button"
                aria-pressed={isSelected}
                onKeyDown={(event) => {
                  if (disabled) {
                    return;
                  }
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(vehicle.id);
                  }
                }}
              >
                <td className="px-4 py-3 font-medium">{vehicle.plateNumber}</td>
                <td className="px-4 py-3">{vehicle.modelName}</td>
                <td className="px-4 py-3">{vehicle.type}</td>
                <td className="px-4 py-3">{vehicle.yearOfProduction}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
