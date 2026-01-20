"use client";

import * as React from "react";

type VehicleAddButtonProps = {
  disabled?: boolean;
  onAdd: () => void;
};

export function VehicleAddButton({ disabled = false, onAdd }: VehicleAddButtonProps) {
  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={disabled}
      className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
    >
      Add Car
    </button>
  );
}
