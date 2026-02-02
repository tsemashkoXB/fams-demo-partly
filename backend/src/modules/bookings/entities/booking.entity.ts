export const bookingStatuses = ['In work', 'Service'] as const;
export type BookingStatus = (typeof bookingStatuses)[number];

export type Booking = {
  id: number;
  vehicleId: number;
  userId: number;
  status: BookingStatus;
  startTime: string; // ISO 8601 timestamp
  endTime: string; // ISO 8601 timestamp
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

export type CreateBookingDto = {
  vehicleId: number;
  userId: number;
  status?: BookingStatus;
  startTime: string;
  endTime: string;
  description?: string | null;
};

export type UpdateBookingDto = Partial<CreateBookingDto>;
