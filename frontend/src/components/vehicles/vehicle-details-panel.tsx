"use client";

import type { Vehicle } from "@/services/vehicles/queries";
import { formatIsoDate } from "@/services/vehicles/date-utils";
import { VehicleImages } from "@/components/vehicles/vehicle-images";
import { VehicleSections } from "@/components/vehicles/vehicle-sections";

type VehicleDetailsPanelProps = {
  vehicle: Vehicle;
  warnings: string[];
  onEdit?: () => void;
  editDisabled?: boolean;
};

type FieldProps = {
  label: string;
  value: string | number | null;
};

function ReadonlyField({ label, value }: FieldProps) {
  return (
    <label className="flex flex-col gap-1 text-xs text-muted-foreground">
      <span>{label}</span>
      <input
        type="text"
        value={value ?? ""}
        readOnly
        className="h-9 rounded-md border border-border bg-muted/40 px-3 text-sm text-foreground"
      />
    </label>
  );
}

export function VehicleDetailsPanel({
  vehicle,
  warnings,
  onEdit,
  editDisabled = false,
}: VehicleDetailsPanelProps) {
  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {vehicle.modelName}
          </h2>
          <button
            type="button"
            onClick={onEdit}
            disabled={editDisabled}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            Edit
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <VehicleImages images={vehicle.images} />
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Plate number</p>
              <p className="text-lg font-semibold text-foreground">
                {vehicle.plateNumber}
              </p>
            </div>
            <ReadonlyField label="Year of production" value={vehicle.yearOfProduction} />
            <ReadonlyField label="VIN" value={vehicle.vin} />
          </div>
        </div>
      </section>

      <VehicleSections vehicle={vehicle} />

      {warnings.length > 0 && (
        <section className="space-y-2 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {warnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </section>
      )}
    </div>
  );
}
