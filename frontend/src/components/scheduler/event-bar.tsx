'use client';

import * as React from 'react';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { STATUS_COLORS, ViewMode, BookingStatus } from '@/lib/scheduler-utils';
import { BookingWithDetails } from '@/services/bookings';

interface EventBarProps {
  booking: BookingWithDetails;
  left: number;
  width: number;
  viewMode: ViewMode;
  onDoubleClick?: (booking: BookingWithDetails) => void;
}

export function EventBar({
  booking,
  left,
  width,
  viewMode,
  onDoubleClick,
}: EventBarProps) {
  const colors = STATUS_COLORS[booking.status as BookingStatus];
  const showText = viewMode !== 'month' && width > 8;

  const handleDoubleClick = React.useCallback(() => {
    onDoubleClick?.(booking);
  }, [booking, onDoubleClick]);

  const formatTimeRange = () => {
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    if (viewMode === 'day') {
      return `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;
    }
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
  };

  const formatTooltipTimeRange = () => {
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    if (viewMode === 'day') {
      return `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;
    }
    // For week/month: show date and time
    return `${format(start, 'MMM d, HH:mm')} - ${format(end, 'MMM d, HH:mm')}`;
  };

  const assignedUser = `${booking.user.name} ${booking.user.surname}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`absolute top-1/2 h-8 -translate-y-1/2 rounded-md cursor-pointer transition-opacity hover:opacity-90 ${colors.bg} ${colors.text}`}
            style={{
              left: `${left}%`,
              width: `${Math.max(width, 1)}%`,
              minWidth: '4px',
            }}
            onDoubleClick={handleDoubleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleDoubleClick();
              }
            }}
          >
            {showText && (
              <div className="flex h-full items-center gap-2 overflow-hidden px-2">
                <span className="truncate text-xs font-medium">
                  {formatTimeRange()}
                </span>
                <span className="truncate text-xs opacity-80">
                  {assignedUser}
                </span>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <div className="font-medium">{booking.vehicle.modelName}</div>
            <div className="text-xs text-muted-foreground">
              {formatTooltipTimeRange()}
            </div>
            <div className="text-xs">
              <span className="font-medium">Assigned:</span> {assignedUser}
            </div>
            <div className="text-xs">
              <span className="font-medium">Status:</span> {booking.status}
            </div>
            {booking.description && (
              <div className="text-xs text-muted-foreground">
                {booking.description}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export const MemoizedEventBar = React.memo(EventBar);
