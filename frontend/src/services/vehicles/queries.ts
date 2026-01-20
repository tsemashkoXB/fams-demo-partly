"use client";

import { useQuery } from "@tanstack/react-query";

export type Vehicle = {
  id: number;
  plateNumber: string;
  modelName: string;
  type: string;
  yearOfProduction: number;
  vin: string;
  currentMileage: number;
  color: string | null;
  engine: string | null;
  fuelType: string | null;
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
  images?: VehicleImage[];
};

export type VehicleImage = {
  id: number;
  vehicleId: number;
  relativePath: string;
  displayOrder: number;
};

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function useVehiclesQuery(search: string) {
  const baseUrl = getApiBaseUrl();
  const query = search.trim();
  const url = query
    ? `${baseUrl}/vehicles?q=${encodeURIComponent(query)}`
    : `${baseUrl}/vehicles`;

  return useQuery({
    queryKey: ["vehicles", query],
    queryFn: () => fetchJson<Vehicle[]>(url),
  });
}

export function useVehicleDetailsQuery(vehicleId?: number) {
  const baseUrl = getApiBaseUrl();

  return useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: () => fetchJson<Vehicle>(`${baseUrl}/vehicles/${vehicleId}`),
    enabled: typeof vehicleId === "number",
  });
}
