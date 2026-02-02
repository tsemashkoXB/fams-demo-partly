/**
 * Scheduler utility functions for timeline calculations
 */

import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  addHours,
  eachDayOfInterval,
  eachHourOfInterval,
  format,
  isSameDay,
} from 'date-fns';

export type ViewMode = 'day' | 'week' | 'month';

export interface TimeSlot {
  start: Date;
  end: Date;
  label: string;
  isToday: boolean;
}

export interface VisibleRange {
  start: Date;
  end: Date;
}

/**
 * Get the visible date range for a given date and view mode
 */
export function getVisibleRange(date: Date, mode: ViewMode): VisibleRange {
  switch (mode) {
    case 'day':
      return {
        start: startOfDay(date),
        end: endOfDay(date),
      };
    case 'week':
      return {
        start: startOfWeek(date, { weekStartsOn: 0 }),
        end: endOfWeek(date, { weekStartsOn: 0 }),
      };
    case 'month':
      return {
        start: startOfMonth(date),
        end: endOfMonth(date),
      };
  }
}

/**
 * Generate time slots for the timeline based on view mode
 */
export function generateTimeSlots(date: Date, mode: ViewMode): TimeSlot[] {
  const today = new Date();
  const range = getVisibleRange(date, mode);

  switch (mode) {
    case 'day': {
      const hours = eachHourOfInterval({ start: range.start, end: range.end });
      return hours.map((hour) => ({
        start: hour,
        end: addHours(hour, 1),
        label: format(hour, 'HH:mm'),
        isToday: isSameDay(hour, today),
      }));
    }
    case 'week':
    case 'month': {
      const days = eachDayOfInterval({ start: range.start, end: range.end });
      return days.map((day) => ({
        start: startOfDay(day),
        end: endOfDay(day),
        label: mode === 'week' ? format(day, 'EEE d') : format(day, 'd'),
        isToday: isSameDay(day, today),
      }));
    }
  }
}

/**
 * Calculate the position and width of an event bar within the timeline
 * Returns values as percentages (0-100)
 * Uses precise time calculations to show actual event duration
 */
export function calculateEventPosition(
  eventStart: Date,
  eventEnd: Date,
  visibleRange: VisibleRange,
  _mode: ViewMode,
): { left: number; width: number } | null {
  const rangeStart = visibleRange.start;
  const rangeEnd = visibleRange.end;

  // Check if event overlaps with visible range
  if (eventEnd <= rangeStart || eventStart >= rangeEnd) {
    return null; // Event is outside visible range
  }

  // Clip event to visible range
  const clippedStart = eventStart < rangeStart ? rangeStart : eventStart;
  const clippedEnd = eventEnd > rangeEnd ? rangeEnd : eventEnd;

  // Use milliseconds for precise calculation across all view modes
  const totalRangeMs = rangeEnd.getTime() - rangeStart.getTime();
  const startOffsetMs = clippedStart.getTime() - rangeStart.getTime();
  const eventDurationMs = clippedEnd.getTime() - clippedStart.getTime();

  const left = (startOffsetMs / totalRangeMs) * 100;
  const width = (eventDurationMs / totalRangeMs) * 100;

  // Ensure minimum visible width (0.5% of timeline) for very short events
  const minWidth = 0.5;
  const adjustedWidth = Math.max(minWidth, width);

  return {
    left: Math.max(0, left),
    width: Math.min(100 - left, adjustedWidth),
  };
}

/**
 * Check if an event is within a visible range
 */
export function isEventVisible(
  eventStart: Date,
  eventEnd: Date,
  visibleRange: VisibleRange,
): boolean {
  return eventStart < visibleRange.end && eventEnd > visibleRange.start;
}

/**
 * Format navigation label based on view mode
 */
export function formatNavigationLabel(date: Date, mode: ViewMode): string {
  switch (mode) {
    case 'day':
      return format(date, 'EEEE, MMMM d, yyyy');
    case 'week': {
      const range = getVisibleRange(date, mode);
      return `${format(range.start, 'MMM d')} - ${format(range.end, 'MMM d, yyyy')}`;
    }
    case 'month':
      return format(date, 'MMMM yyyy');
  }
}

/**
 * Navigate to next/previous period based on view mode
 */
export function navigateDate(
  date: Date,
  direction: 'prev' | 'next',
  mode: ViewMode,
): Date {
  const delta = direction === 'next' ? 1 : -1;

  switch (mode) {
    case 'day':
      return addDays(date, delta);
    case 'week':
      return addDays(date, delta * 7);
    case 'month':
      // Use date-fns addMonths for month navigation
      const newDate = new Date(date);
      newDate.setMonth(newDate.getMonth() + delta);
      return newDate;
  }
}

/**
 * Get column width class based on view mode
 */
export function getColumnWidthClass(mode: ViewMode): string {
  switch (mode) {
    case 'day':
      return 'w-12'; // 48px for hourly columns
    case 'week':
      return 'w-24'; // 96px for daily columns in week view
    case 'month':
      return 'w-8'; // 32px for narrow daily columns in month view
  }
}

/**
 * Get column width in pixels based on view mode
 */
export function getColumnWidthPx(mode: ViewMode): number {
  switch (mode) {
    case 'day':
      return 48; // w-12
    case 'week':
      return 96; // w-24
    case 'month':
      return 32; // w-8
  }
}

/**
 * Status colors for event bars
 */
export const STATUS_COLORS = {
  'In work': {
    bg: 'bg-[#2F6FED]',
    text: 'text-white',
    hex: '#2F6FED',
  },
  Service: {
    bg: 'bg-amber-500',
    text: 'text-white',
    hex: '#F59E0B',
  },
} as const;

export type BookingStatus = keyof typeof STATUS_COLORS;

/**
 * Calculate the position of the current time within the visible range
 * Returns left position as a percentage (0-100), or null if current time is outside range
 */
export function calculateCurrentTimePosition(
  visibleRange: VisibleRange,
): number | null {
  const now = new Date();
  const rangeStart = visibleRange.start;
  const rangeEnd = visibleRange.end;

  // Check if current time is within visible range
  if (now < rangeStart || now > rangeEnd) {
    return null;
  }

  const totalRangeMs = rangeEnd.getTime() - rangeStart.getTime();
  const offsetMs = now.getTime() - rangeStart.getTime();

  return (offsetMs / totalRangeMs) * 100;
}
