"use client";

import type { Vehicle } from "@/services/vehicles/queries";
import { formatIsoDate } from "@/services/vehicles/date-utils";

type VehicleSectionsProps = {
  vehicle: Vehicle;
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

export function VehicleSections({ vehicle }: VehicleSectionsProps) {
  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Characteristics</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <ReadonlyField label="Type" value={vehicle.type} />
          <ReadonlyField label="Current mileage" value={vehicle.currentMileage} />
          <ReadonlyField label="Color" value={vehicle.color} />
          <ReadonlyField label="Engine" value={vehicle.engine} />
          <ReadonlyField label="Fuel type" value={vehicle.fuelType} />
          <ReadonlyField label="Payload" value={vehicle.payload} />
          <ReadonlyField label="Seats" value={vehicle.seats} />
          <ReadonlyField label="Full mass" value={vehicle.fullMass} />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Documentation</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <ReadonlyField label="Vehicle passport" value={vehicle.vehiclePassport} />
          <ReadonlyField
            label="Vehicle passport issued"
            value={formatIsoDate(vehicle.vehiclePassportIssuedDate)}
          />
          <ReadonlyField label="Insurance" value={vehicle.insurance} />
          <ReadonlyField
            label="Insurance expires at"
            value={formatIsoDate(vehicle.insuranceExpiresAt)}
          />
          <ReadonlyField label="Next service at" value={vehicle.nextServiceAtMileage} />
          <ReadonlyField
            label="Next service till"
            value={formatIsoDate(vehicle.nextServiceTillDate)}
          />
          <ReadonlyField
            label="State inspection expires at"
            value={formatIsoDate(vehicle.stateInspectionExpiresAt)}
          />
        </div>
      </section>
    </div>
  );
}
