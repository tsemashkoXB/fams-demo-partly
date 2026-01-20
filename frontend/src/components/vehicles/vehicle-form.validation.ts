export type VehicleFormValues = {
  plateNumber: string;
  modelName: string;
  type: string;
  yearOfProduction: string;
  vin: string;
  currentMileage: string;
  color: string;
  engine: string;
  fuelType: string;
  payload: string;
  seats: string;
  fullMass: string;
  vehiclePassport: string;
  vehiclePassportIssuedDate: string;
  insurance: string;
  insuranceExpiresAt: string;
  nextServiceAtMileage: string;
  nextServiceTillDate: string;
  stateInspectionExpiresAt: string;
};

export type VehicleFormErrors = Partial<Record<keyof VehicleFormValues, string>>;

export function validateVehicleForm(values: VehicleFormValues): VehicleFormErrors {
  const errors: VehicleFormErrors = {};
  const year = Number(values.yearOfProduction);

  if (!values.plateNumber.trim()) {
    errors.plateNumber = "Plate number is required";
  }
  if (!values.modelName.trim()) {
    errors.modelName = "Model name is required";
  }
  if (!values.type.trim()) {
    errors.type = "Vehicle type is required";
  }
  if (!values.vin.trim()) {
    errors.vin = "VIN is required";
  }
  if (!values.yearOfProduction.trim() || Number.isNaN(year)) {
    errors.yearOfProduction = "Year is required";
  } else {
    const maxYear = new Date().getFullYear() + 1;
    if (year < 1900 || year > maxYear) {
      errors.yearOfProduction = `Year must be between 1900 and ${maxYear}`;
    }
  }

  const numericFields: Array<[keyof VehicleFormValues, string]> = [
    ["currentMileage", "Current mileage"],
    ["payload", "Payload"],
    ["seats", "Seats"],
    ["fullMass", "Full mass"],
    ["nextServiceAtMileage", "Next service at"],
  ];

  for (const [field, label] of numericFields) {
    const value = values[field];
    if (value && Number(value) < 0) {
      errors[field] = `${label} must be 0 or greater`;
    }
  }

  const dateFields: Array<[keyof VehicleFormValues, string]> = [
    ["vehiclePassportIssuedDate", "Vehicle passport issued"],
    ["insuranceExpiresAt", "Insurance expires at"],
    ["nextServiceTillDate", "Next service till"],
    ["stateInspectionExpiresAt", "State inspection expires at"],
  ];

  for (const [field, label] of dateFields) {
    const value = values[field];
    if (value && Number.isNaN(Date.parse(value))) {
      errors[field] = `${label} must be selected from the date picker`;
    }
  }

  return errors;
}
