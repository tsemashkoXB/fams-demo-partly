import { VehicleImage } from './vehicle-image.entity';

export const vehicleTypes = ['PC', 'Pass Van', 'Van', 'CV', 'Bus'] as const;
export type VehicleType = (typeof vehicleTypes)[number];

export const fuelTypes = ['Petrol', 'Gas', 'Diesel'] as const;
export type FuelType = (typeof fuelTypes)[number];

export type Vehicle = {
  id: number;
  plateNumber: string;
  modelName: string;
  type: VehicleType;
  yearOfProduction: number;
  vin: string;
  currentMileage: number;
  color: string | null;
  engine: string | null;
  fuelType: FuelType | null;
  payload: number | null;
  seats: number | null;
  fullMass: number | null;
  vehiclePassport: string | null;
  vehiclePassportIssuedDate: string | null;
  insurance: string | null;
  insuranceExpiresAt: string | null;
  nextServiceAtMileage: number | null;
  nextServiceTillDate: string | null;
  stateInspectionExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  images?: VehicleImage[];
};
