'use client';

import * as React from 'react';
import { TimelineHeader } from './timeline-header';
import { VehicleRowData } from './vehicle-row';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { EventBar } from './event-bar';
import { BookingWithDetails } from '@/services/bookings';
import { useVehiclesQuery } from '@/services/vehicles/queries';
import {
  ViewMode,
  generateTimeSlots,
  getVisibleRange,
  calculateEventPosition,
  calculateCurrentTimePosition,
  getColumnWidthClass,
  getColumnWidthPx,
} from '@/lib/scheduler-utils';
import type { SchedulerFilters } from './scheduler-layout';

interface SchedulerTimelineProps {
  viewMode: ViewMode;
  currentDate: Date;
  bookings: BookingWithDetails[];
  filters: SchedulerFilters;
  isLoading: boolean;
  onNavigate: (direction: 'prev' | 'next') => void;
  onToday: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  onEditBooking: (booking: BookingWithDetails) => void;
}

export function SchedulerTimeline({
  viewMode,
  currentDate,
  bookings,
  filters,
  isLoading,
  onNavigate,
  onToday,
  onViewModeChange,
  onEditBooking,
}: SchedulerTimelineProps) {
  const { data: vehicles = [], isLoading: vehiclesLoading } =
    useVehiclesQuery('');

  const visibleRange = React.useMemo(
    () => getVisibleRange(currentDate, viewMode),
    [currentDate, viewMode],
  );

  const timeSlots = React.useMemo(
    () => generateTimeSlots(currentDate, viewMode),
    [currentDate, viewMode],
  );

  // Filter vehicles based on filters
  const filteredVehicles = React.useMemo(() => {
    let result = vehicles;

    // Search filter
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((v) =>
        v.modelName.toLowerCase().includes(searchLower),
      );
    }

    // Vehicle type filter
    if (filters.vehicleType) {
      result = result.filter((v) => v.type === filters.vehicleType);
    }

    // Status filter - show vehicles that match one of the checked statuses at current time
    if (filters.statuses.length > 0) {
      const vehicleIdsWithStatus = new Set<number>();
      const now = new Date();

      // Check for requested statuses
      const wantsAvailable = filters.statuses.includes('Available');
      const wantsInWork = filters.statuses.includes('In work');
      const wantsService = filters.statuses.includes('Service');

      for (const vehicle of result) {
        const vehicleBookings = bookings.filter(
          (b) => b.vehicleId === vehicle.id,
        );

        // Find the active booking at current time (if any)
        const activeBooking = vehicleBookings.find((b) => {
          const start = new Date(b.startTime);
          const end = new Date(b.endTime);
          return now >= start && now < end;
        });

        // Determine current status
        const isInWorkNow = activeBooking?.status === 'In work';
        const isServiceNow = activeBooking?.status === 'Service';
        const isAvailableNow = !activeBooking;

        if (
          (wantsInWork && isInWorkNow) ||
          (wantsService && isServiceNow) ||
          (wantsAvailable && isAvailableNow)
        ) {
          vehicleIdsWithStatus.add(vehicle.id);
        }
      }

      result = result.filter((v) => vehicleIdsWithStatus.has(v.id));
    }

    // Available during period filter - show only vehicles with no bookings in the specified period
    if (
      filters.availableDuringPeriod &&
      filters.periodStart &&
      filters.periodEnd
    ) {
      const periodStart = new Date(filters.periodStart);
      const periodEnd = new Date(filters.periodEnd);
      // Set period end to end of day for inclusive comparison
      periodEnd.setHours(23, 59, 59, 999);

      result = result.filter((vehicle) => {
        const vehicleBookings = bookings.filter(
          (b) => b.vehicleId === vehicle.id,
        );

        // Check if any booking overlaps with the specified period
        const hasOverlappingBooking = vehicleBookings.some((booking) => {
          const bookingStart = new Date(booking.startTime);
          const bookingEnd = new Date(booking.endTime);
          // Overlap exists if booking starts before period ends AND booking ends after period starts
          return bookingStart < periodEnd && bookingEnd > periodStart;
        });

        // Keep only vehicles with NO overlapping bookings (i.e., available during the period)
        return !hasOverlappingBooking;
      });
    }

    return result;
  }, [vehicles, filters, bookings]);

  // Group bookings by vehicle
  const bookingsByVehicle = React.useMemo(() => {
    const map = new Map<number, BookingWithDetails[]>();
    for (const booking of bookings) {
      const current = map.get(booking.vehicleId) ?? [];
      current.push(booking);
      map.set(booking.vehicleId, current);
    }
    return map;
  }, [bookings]);

  const columnWidthClass = getColumnWidthClass(viewMode);
  const columnWidthPx = getColumnWidthPx(viewMode);
  const totalGridWidth = timeSlots.length * columnWidthPx;

  // Current time position for "now" indicator
  const [currentTimePosition, setCurrentTimePosition] = React.useState<
    number | null
  >(() => calculateCurrentTimePosition(visibleRange));

  // Update current time position every minute
  React.useEffect(() => {
    const updatePosition = () => {
      setCurrentTimePosition(calculateCurrentTimePosition(visibleRange));
    };

    // Update immediately when visible range changes
    updatePosition();

    // Set up interval to update every minute
    const intervalId = setInterval(updatePosition, 60000);

    return () => clearInterval(intervalId);
  }, [visibleRange]);

  // Refs for synchronized scrolling
  const vehicleListRef = React.useRef<HTMLDivElement>(null);
  const timelineHeaderRef = React.useRef<HTMLDivElement>(null);
  const timelineBodyRef = React.useRef<HTMLDivElement>(null);

  // Sync vertical scroll between vehicle list and timeline body
  const handleTimelineScroll = React.useCallback(() => {
    if (timelineBodyRef.current && vehicleListRef.current) {
      vehicleListRef.current.scrollTop = timelineBodyRef.current.scrollTop;
    }
    // Sync horizontal scroll between header and body
    if (timelineBodyRef.current && timelineHeaderRef.current) {
      timelineHeaderRef.current.scrollLeft = timelineBodyRef.current.scrollLeft;
    }
  }, []);

  if (vehiclesLoading || isLoading) {
    return (
      <div className="flex min-w-0 flex-1 flex-col gap-4 min-h-0 overflow-hidden">
        <TimelineHeader
          viewMode={viewMode}
          currentDate={currentDate}
          onNavigate={onNavigate}
          onToday={onToday}
          onViewModeChange={onViewModeChange}
        />
        <div className="flex flex-1 items-center justify-center rounded-lg border border-border bg-card">
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4 min-h-0 overflow-hidden">
      <TimelineHeader
        viewMode={viewMode}
        currentDate={currentDate}
        onNavigate={onNavigate}
        onToday={onToday}
        onViewModeChange={onViewModeChange}
      />

      <div className="flex min-w-0 flex-1 min-h-0 rounded-lg border border-border bg-card overflow-hidden">
        {/* Fixed vehicle column */}
        <div className="w-[200px] shrink-0 flex flex-col border-r border-border bg-muted/30">
          {/* Header */}
          <div className="px-4 py-2 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground">
              Vehicle
            </span>
          </div>
          {/* Vehicle list - synced scroll with timeline */}
          <div ref={vehicleListRef} className="flex-1 overflow-hidden">
            {filteredVehicles.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center px-4">
                <span className="text-sm text-muted-foreground text-center">
                  {vehicles.length === 0 ? 'No vehicles' : 'No matches'}
                </span>
              </div>
            ) : (
              filteredVehicles.map((vehicle) => {
                const vehicleData: VehicleRowData = {
                  id: vehicle.id,
                  plateNumber: vehicle.plateNumber,
                  modelName: vehicle.modelName,
                  type: vehicle.type,
                  imageUrl: vehicle.images?.[0]?.relativePath
                    ? `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}${vehicle.images[0].relativePath}`
                    : undefined,
                };

                return (
                  <div
                    key={vehicle.id}
                    className="flex h-[62px] items-center gap-3 px-4 border-b border-border last:border-b-0"
                  >
                    <Avatar className="h-10 w-10 rounded-lg shrink-0">
                      {vehicleData.imageUrl ? (
                        <Image
                          src={vehicleData.imageUrl}
                          alt={vehicleData.modelName}
                          width={40}
                          height={40}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-medium">
                          {vehicleData.modelName
                            .split(' ')
                            .map((word) => word[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-foreground">
                        {vehicleData.modelName}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="truncate">
                          {vehicleData.plateNumber}
                        </span>
                        <span className="text-border">•</span>
                        <span className="truncate">{vehicleData.type}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Timeline area - flexible, scrollable */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {/* Time slots header - synced horizontal scroll */}
          <div
            ref={timelineHeaderRef}
            className="shrink-0 border-b border-border bg-muted/50 overflow-hidden"
          >
            <div className="flex relative" style={{ width: totalGridWidth }}>
              {timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className={`shrink-0 border-r border-border last:border-r-0 px-1 py-2 text-center ${columnWidthClass} ${
                    slot.isToday ? 'bg-primary/5' : ''
                  }`}
                >
                  <span
                    className={`text-xs font-medium ${
                      slot.isToday ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {slot.label}
                  </span>
                </div>
              ))}
              {/* Current time indicator in header */}
              {currentTimePosition !== null && (
                <div
                  className="absolute top-0 bottom-0 pointer-events-none"
                  style={{ left: (currentTimePosition / 100) * totalGridWidth }}
                >
                  <div className="w-0.5 h-full bg-red-500" />
                </div>
              )}
            </div>
          </div>

          {/* Timeline rows - main scroll area */}
          <div
            ref={timelineBodyRef}
            className="flex-1 min-h-0 overflow-auto"
            onScroll={handleTimelineScroll}
          >
            {/* Content wrapper for positioning the now indicator */}
            <div className="relative" style={{ width: totalGridWidth }}>
              {/* Current time indicator line */}
              {currentTimePosition !== null && (
                <div
                  className="absolute top-0 bottom-0 z-20 pointer-events-none"
                  style={{ left: (currentTimePosition / 100) * totalGridWidth }}
                >
                  <div className="relative h-full">
                    {/* Line */}
                    <div className="absolute top-0 bottom-0 w-0.5 bg-red-500" />
                    {/* Top indicator dot */}
                    <div className="absolute -top-1 -left-1.5 w-3.5 h-3.5 rounded-full bg-red-500" />
                  </div>
                </div>
              )}
              {filteredVehicles.length === 0 ? (
                <div className="h-[200px]" />
              ) : (
                filteredVehicles.map((vehicle) => {
                  const vehicleBookings =
                    bookingsByVehicle.get(vehicle.id) ?? [];

                  return (
                    <div
                      key={vehicle.id}
                      className="relative h-[62px] border-b border-border last:border-b-0"
                    >
                      {/* Background grid */}
                      <div className="absolute inset-0 flex">
                        {timeSlots.map((slot, index) => (
                          <div
                            key={index}
                            className={`shrink-0 border-r border-border/50 last:border-r-0 h-full ${columnWidthClass} ${
                              slot.isToday ? 'bg-primary/5' : ''
                            }`}
                          />
                        ))}
                      </div>

                      {/* Event bars */}
                      {vehicleBookings.map((booking) => {
                        const position = calculateEventPosition(
                          new Date(booking.startTime),
                          new Date(booking.endTime),
                          visibleRange,
                          viewMode,
                        );

                        if (!position) return null;

                        return (
                          <EventBar
                            key={booking.id}
                            booking={booking}
                            left={position.left}
                            width={position.width}
                            viewMode={viewMode}
                            onDoubleClick={onEditBooking}
                          />
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
