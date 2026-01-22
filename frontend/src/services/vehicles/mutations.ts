"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Vehicle, VehicleImage } from "@/services/vehicles/queries";

export type VehicleUpdateInput = Partial<
  Omit<Vehicle, "id" | "createdAt" | "updatedAt" | "images">
>;

export type VehicleCreateInput = Omit<
  Vehicle,
  "id" | "createdAt" | "updatedAt" | "images"
>;

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function uploadVehicleImage(
  vehicleId: number,
  file: File
): Promise<VehicleImage> {
  const baseUrl = getApiBaseUrl();
  const formData = new FormData();
  formData.append("file", file);
  return fetchJson(`${baseUrl}/vehicles/${vehicleId}/images`, {
    method: "POST",
    body: formData,
  });
}

export function useUpdateVehicleMutation(vehicleId: number) {
  const queryClient = useQueryClient();
  const baseUrl = getApiBaseUrl();

  return useMutation({
    mutationFn: (payload: VehicleUpdateInput) =>
      fetchJson<Vehicle>(`${baseUrl}/vehicles/${vehicleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle", vehicleId] });
    },
  });
}

export function useCreateVehicleMutation() {
  const queryClient = useQueryClient();
  const baseUrl = getApiBaseUrl();

  return useMutation({
    mutationFn: (payload: VehicleCreateInput) =>
      fetchJson<Vehicle>(`${baseUrl}/vehicles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}

export function useDeleteVehicleMutation() {
  const queryClient = useQueryClient();
  const baseUrl = getApiBaseUrl();

  return useMutation({
    mutationFn: async (vehicleId: number) => {
      const response = await fetch(`${baseUrl}/vehicles/${vehicleId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}

export function useUploadVehicleImageMutation(vehicleId: number) {
  const queryClient = useQueryClient();
  const baseUrl = getApiBaseUrl();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return fetchJson(`${baseUrl}/vehicles/${vehicleId}/images`, {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle", vehicleId] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}

export function useDeleteVehicleImageMutation(vehicleId: number) {
  const queryClient = useQueryClient();
  const baseUrl = getApiBaseUrl();

  return useMutation({
    mutationFn: async (imageId: number) => {
      const response = await fetch(
        `${baseUrl}/vehicles/${vehicleId}/images/${imageId}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle", vehicleId] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}
