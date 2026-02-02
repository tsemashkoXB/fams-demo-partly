'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Types
export type BookingStatus = 'In work' | 'Service';

export type Booking = {
  id: number;
  vehicleId: number;
  userId: number;
  status: BookingStatus;
  startTime: string;
  endTime: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BookingWithDetails = Booking & {
  vehicle: {
    id: number;
    plateNumber: string;
    modelName: string;
    type: string;
  };
  user: {
    id: number;
    name: string;
    surname: string;
  };
};

export type CreateBookingPayload = {
  vehicleId: number;
  userId: number;
  status?: BookingStatus;
  startTime: string;
  endTime: string;
  description?: string | null;
};

export type UpdateBookingPayload = Partial<CreateBookingPayload>;

export type BookingFilters = {
  vehicleId?: number;
  userId?: number;
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
};

export type ConflictError = {
  statusCode: 409;
  message: string;
  error: 'Conflict';
  conflictingBooking: {
    id: number;
    startTime: string;
    endTime: string;
  };
};

// API functions
function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    // Try to parse error response
    try {
      const errorData = await response.json();
      const error = new Error(
        errorData.message || `Request failed: ${response.status}`,
      );
      (error as Error & { response?: unknown }).response = errorData;
      throw error;
    } catch {
      throw new Error(`Request failed: ${response.status}`);
    }
  }
  return response.json() as Promise<T>;
}

export async function listBookings(
  filters: BookingFilters = {},
): Promise<BookingWithDetails[]> {
  const baseUrl = getApiBaseUrl();
  const params = new URLSearchParams();

  if (filters.vehicleId !== undefined) {
    params.set('vehicleId', String(filters.vehicleId));
  }
  if (filters.userId !== undefined) {
    params.set('userId', String(filters.userId));
  }
  if (filters.status !== undefined) {
    params.set('status', filters.status);
  }
  if (filters.startDate !== undefined) {
    params.set('startDate', filters.startDate);
  }
  if (filters.endDate !== undefined) {
    params.set('endDate', filters.endDate);
  }

  const queryString = params.toString();
  const url = queryString
    ? `${baseUrl}/bookings?${queryString}`
    : `${baseUrl}/bookings`;

  return fetchJson<BookingWithDetails[]>(url);
}

export async function getBooking(id: number): Promise<BookingWithDetails> {
  const baseUrl = getApiBaseUrl();
  return fetchJson<BookingWithDetails>(`${baseUrl}/bookings/${id}`);
}

export async function createBooking(
  payload: CreateBookingPayload,
): Promise<BookingWithDetails> {
  const baseUrl = getApiBaseUrl();
  return fetchJson<BookingWithDetails>(`${baseUrl}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateBooking(
  id: number,
  payload: UpdateBookingPayload,
): Promise<BookingWithDetails> {
  const baseUrl = getApiBaseUrl();
  return fetchJson<BookingWithDetails>(`${baseUrl}/bookings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deleteBooking(id: number): Promise<void> {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/bookings/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
}

export async function getAvailableVehicleIds(
  startDate: string,
  endDate: string,
): Promise<number[]> {
  const baseUrl = getApiBaseUrl();
  const params = new URLSearchParams({
    startDate,
    endDate,
  });
  const result = await fetchJson<{ vehicleIds: number[] }>(
    `${baseUrl}/bookings/available-vehicles?${params.toString()}`,
  );
  return result.vehicleIds;
}

// React Query hooks
export function useBookingsQuery(filters: BookingFilters = {}) {
  return useQuery({
    queryKey: ['bookings', filters],
    queryFn: () => listBookings(filters),
  });
}

export function useBookingDetailsQuery(bookingId?: number) {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => getBooking(bookingId as number),
    enabled: typeof bookingId === 'number',
  });
}

export function useAvailableVehiclesQuery(
  startDate: string | undefined,
  endDate: string | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: ['available-vehicles', startDate, endDate],
    queryFn: () => getAvailableVehicleIds(startDate!, endDate!),
    enabled: enabled && !!startDate && !!endDate,
  });
}

export function useCreateBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['available-vehicles'] });
    },
  });
}

export function useUpdateBookingMutation(bookingId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateBookingPayload) =>
      updateBooking(bookingId, payload),
    onSuccess: (updatedBooking: BookingWithDetails) => {
      queryClient.setQueryData(['booking', bookingId], updatedBooking);
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['available-vehicles'] });
    },
  });
}

export function useDeleteBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: number) => deleteBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['available-vehicles'] });
    },
  });
}
