'use client';

import * as React from 'react';
import { FilterPanel } from './filter-panel';
import { SchedulerTimeline } from './scheduler-timeline';
import { BookingPopup } from './booking-popup';
import { useBookingsQuery, BookingWithDetails } from '@/services/bookings';
import { ViewMode, getVisibleRange, navigateDate } from '@/lib/scheduler-utils';

export type SchedulerFilters = {
  search: string;
  statuses: string[];
  vehicleType: string;
  periodStart: string;
  periodEnd: string;
  availableDuringPeriod: boolean;
};

const defaultFilters: SchedulerFilters = {
  search: '',
  statuses: [],
  vehicleType: '',
  periodStart: '',
  periodEnd: '',
  availableDuringPeriod: false,
};

export function SchedulerLayout() {
  const [viewMode, setViewMode] = React.useState<ViewMode>('day');
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [filters, setFilters] =
    React.useState<SchedulerFilters>(defaultFilters);
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [bookingPopup, setBookingPopup] = React.useState<{
    isOpen: boolean;
    booking: BookingWithDetails | null;
  }>({ isOpen: false, booking: null });

  // Get visible range for data fetching
  const visibleRange = React.useMemo(
    () => getVisibleRange(currentDate, viewMode),
    [currentDate, viewMode],
  );

  // Fetch bookings for visible range
  const { data: bookings = [], isLoading } = useBookingsQuery({
    startDate: visibleRange.start.toISOString(),
    endDate: visibleRange.end.toISOString(),
  });

  // Navigation handlers
  const handleNavigate = React.useCallback(
    (direction: 'prev' | 'next') => {
      setCurrentDate((date) => navigateDate(date, direction, viewMode));
    },
    [viewMode],
  );

  const handleToday = React.useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const handleViewModeChange = React.useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  const handleCalendarDateSelect = React.useCallback((date: Date) => {
    setCurrentDate(date);
    setViewMode('day');
    setShowCalendar(false);
  }, []);

  const handleNewBooking = React.useCallback(() => {
    setBookingPopup({ isOpen: true, booking: null });
  }, []);

  const handleEditBooking = React.useCallback((booking: BookingWithDetails) => {
    setBookingPopup({ isOpen: true, booking });
  }, []);

  const handleClosePopup = React.useCallback(() => {
    setBookingPopup({ isOpen: false, booking: null });
  }, []);

  const handleClearFilters = React.useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <div className="flex h-full min-h-0 gap-6 overflow-hidden">
      {/* Filter Panel - Left side */}
      <aside className="w-[300px] shrink-0 overflow-auto">
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          onNewBooking={handleNewBooking}
          showCalendar={showCalendar}
          onToggleCalendar={() => setShowCalendar(!showCalendar)}
          onCalendarDateSelect={handleCalendarDateSelect}
          currentDate={currentDate}
          onClearFilters={handleClearFilters}
        />
      </aside>

      {/* Scheduler Area - Right side */}
      <main className="flex min-w-0 flex-1 flex-col min-h-0 overflow-hidden">
        <SchedulerTimeline
          viewMode={viewMode}
          currentDate={currentDate}
          bookings={bookings}
          filters={filters}
          isLoading={isLoading}
          onNavigate={handleNavigate}
          onToday={handleToday}
          onViewModeChange={handleViewModeChange}
          onEditBooking={handleEditBooking}
        />
      </main>

      {/* Booking Popup */}
      {bookingPopup.isOpen && (
        <BookingPopup
          booking={bookingPopup.booking}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
}
