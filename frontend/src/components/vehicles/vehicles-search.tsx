"use client";

import * as React from "react";

type VehiclesSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function VehiclesSearch({ value, onChange }: VehiclesSearchProps) {
  return (
    <div className="w-full max-w-sm">
      <label htmlFor="vehicles-search" className="sr-only">
        Search vehicles
      </label>
      <input
        id="vehicles-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by plate, model, type, year"
        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
}
