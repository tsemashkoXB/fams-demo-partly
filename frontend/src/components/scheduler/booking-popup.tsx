'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { DatePicker } from '@/components/ui/date-picker';
import {
  BookingWithDetails,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
} from '@/services/bookings';
import { useVehiclesQuery } from '@/services/vehicles/queries';
import { useUsersQuery } from '@/services/users.queries';
import {
  validateBookingForm,
  BookingFormErrors,
} from './booking-popup.validation';

interface BookingPopupProps {
  booking: BookingWithDetails | null;
  onClose: () => void;
}

export function BookingPopup({ booking, onClose }: BookingPopupProps) {
  const isEditing = booking !== null;

  const { data: vehicles = [] } = useVehiclesQuery('');
  const { data: users = [] } = useUsersQuery('');

  const [vehicleId, setVehicleId] = React.useState<string>(
    booking?.vehicleId.toString() ?? '',
  );
  const [userId, setUserId] = React.useState<string>(
    booking?.userId.toString() ?? '',
  );
  const [description, setDescription] = React.useState(
    booking?.description ?? '',
  );
  const [isService, setIsService] = React.useState(
    booking?.status === 'Service',
  );
  const [startDate, setStartDate] = React.useState(
    booking ? booking.startTime.slice(0, 10) : '',
  );
  const [startTime, setStartTime] = React.useState(
    booking ? booking.startTime.slice(11, 16) : '',
  );
  const [endDate, setEndDate] = React.useState(
    booking ? booking.endTime.slice(0, 10) : '',
  );
  const [endTime, setEndTime] = React.useState(
    booking ? booking.endTime.slice(11, 16) : '',
  );

  const [errors, setErrors] = React.useState<BookingFormErrors>({});
  const [apiError, setApiError] = React.useState<string | null>(null);

  const createMutation = useCreateBookingMutation();
  const updateMutation = useUpdateBookingMutation(booking?.id ?? 0);
  const deleteMutation = useDeleteBookingMutation();

  const handleSave = () => {
    const formData = {
      vehicleId,
      userId,
      startDate,
      startTime,
      endDate,
      endTime,
    };

    const validationErrors = validateBookingForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const startDateTime = `${startDate}T${startTime}:00.000Z`;
    const endDateTime = `${endDate}T${endTime}:00.000Z`;

    const payload = {
      vehicleId: parseInt(vehicleId, 10),
      userId: parseInt(userId, 10),
      status: isService ? ('Service' as const) : ('In work' as const),
      startTime: startDateTime,
      endTime: endDateTime,
      description: description.trim() || null,
    };

    setApiError(null);

    if (isEditing) {
      updateMutation.mutate(payload, {
        onSuccess: onClose,
        onError: (error: Error & { response?: { message?: string } }) => {
          setApiError(error.response?.message ?? error.message);
        },
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: onClose,
        onError: (error: Error & { response?: { message?: string } }) => {
          setApiError(error.response?.message ?? error.message);
        },
      });
    }
  };

  const handleDelete = () => {
    if (!booking) return;
    deleteMutation.mutate(booking.id, {
      onSuccess: onClose,
    });
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">
            {isEditing ? 'Edit booking' : 'New booking'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* API Error */}
          {apiError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {apiError}
            </div>
          )}

          {/* Vehicle */}
          <div className="space-y-2">
            <Label htmlFor="vehicle">Car</Label>
            <Select value={vehicleId} onValueChange={setVehicleId}>
              <SelectTrigger id="vehicle">
                <SelectValue placeholder="Select a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                    {vehicle.modelName} ({vehicle.plateNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.vehicleId && (
              <p className="text-xs text-destructive">{errors.vehicleId}</p>
            )}
          </div>

          {/* User */}
          <div className="space-y-2">
            <Label htmlFor="user">User</Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger id="user">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users
                  .filter((user) => user.status === 'Active')
                  .map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name} {user.surname}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.userId && (
              <p className="text-xs text-destructive">{errors.userId}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              rows={2}
            />
          </div>

          {/* Service checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={isService}
              onCheckedChange={(checked) => setIsService(checked === true)}
            />
            <span className="text-sm">Service</span>
          </label>

          {/* Time period */}
          <div className="space-y-2">
            <Label>Time period</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">
                  Start date
                </span>
                <DatePicker
                  value={startDate ? `${startDate}T00:00:00.000Z` : ''}
                  onChange={(iso) => setStartDate(iso.slice(0, 10))}
                  placeholder="Select date"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">
                  Start time
                </span>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </div>
            {errors.startTime && (
              <p className="text-xs text-destructive">{errors.startTime}</p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">End date</span>
                <DatePicker
                  value={endDate ? `${endDate}T00:00:00.000Z` : ''}
                  onChange={(iso) => setEndDate(iso.slice(0, 10))}
                  placeholder="Select date"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">End time</span>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
            {errors.endTime && (
              <p className="text-xs text-destructive">{errors.endTime}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            {isEditing && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isDeleting || isSaving}
                  >
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete booking?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The booking will be
                      permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Close
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
