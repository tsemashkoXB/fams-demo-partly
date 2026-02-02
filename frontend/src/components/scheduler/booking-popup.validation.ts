export type BookingFormData = {
  vehicleId: string;
  userId: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
};

export type BookingFormErrors = {
  vehicleId?: string;
  userId?: string;
  startTime?: string;
  endTime?: string;
};

export function validateBookingForm(data: BookingFormData): BookingFormErrors {
  const errors: BookingFormErrors = {};

  // Vehicle is required
  if (!data.vehicleId) {
    errors.vehicleId = 'Vehicle is required';
  }

  // User is required
  if (!data.userId) {
    errors.userId = 'User is required';
  }

  // Start time is required
  if (!data.startDate || !data.startTime) {
    errors.startTime = 'Start time is required';
  }

  // End time is required
  if (!data.endDate || !data.endTime) {
    errors.endTime = 'End time is required';
  }

  // End time must be after start time
  if (data.startDate && data.startTime && data.endDate && data.endTime) {
    const start = new Date(`${data.startDate}T${data.startTime}`);
    const end = new Date(`${data.endDate}T${data.endTime}`);

    if (end <= start) {
      errors.endTime = 'End time must be after start time';
    }
  }

  return errors;
}
