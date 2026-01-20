import type { Vehicle } from "@/services/vehicles/queries";

type Warning = {
  id: string;
  message: string;
};

function daysUntil(dateValue: string): number {
  const now = new Date();
  const target = new Date(dateValue);
  const diffMs = target.getTime() - now.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function getVehicleWarnings(vehicle: Vehicle): Warning[] {
  const warnings: Warning[] = [];

  if (
    vehicle.nextServiceAtMileage !== null &&
    vehicle.currentMileage !== null &&
    vehicle.nextServiceAtMileage - vehicle.currentMileage < 1000
  ) {
    warnings.push({
      id: "service-distance",
      message: "Less than 1000 km to next service check",
    });
  }

  if (vehicle.nextServiceTillDate) {
    const days = daysUntil(vehicle.nextServiceTillDate);
    if (days < 30) {
      warnings.push({
        id: "service-date",
        message: "Less than 30 days to next service check",
      });
    }
  }

  if (vehicle.stateInspectionExpiresAt) {
    const days = daysUntil(vehicle.stateInspectionExpiresAt);
    if (days < 30) {
      warnings.push({
        id: "technical-inspection",
        message: "Less than 30 days to next technical inspection",
      });
      warnings.push({
        id: "state-inspection",
        message: "Less than 30 days before the state inspection expires",
      });
    }
  }

  if (vehicle.insuranceExpiresAt) {
    const days = daysUntil(vehicle.insuranceExpiresAt);
    if (days < 30) {
      warnings.push({
        id: "insurance",
        message: "Less than 30 days before the insurance expires",
      });
    }
  }

  return warnings;
}
