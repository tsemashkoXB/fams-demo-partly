'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ViewMode,
  formatNavigationLabel,
  STATUS_COLORS,
} from '@/lib/scheduler-utils';

interface TimelineHeaderProps {
  viewMode: ViewMode;
  currentDate: Date;
  onNavigate: (direction: 'prev' | 'next') => void;
  onToday: () => void;
  onViewModeChange: (mode: ViewMode) => void;
}

const VIEW_MODES: { value: ViewMode; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

export function TimelineHeader({
  viewMode,
  currentDate,
  onNavigate,
  onToday,
  onViewModeChange,
}: TimelineHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-card p-4 shadow-sm border border-border shrink-0">
      {/* Left: Navigation */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="font-medium"
        >
          Today
        </Button>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onNavigate('prev')}
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onNavigate('next')}
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm font-medium text-foreground min-w-[200px]">
          {formatNavigationLabel(currentDate, viewMode)}
        </span>
      </div>

      {/* Center: View mode toggle */}
      <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
        {VIEW_MODES.map(({ value, label }) => (
          <Button
            key={value}
            variant={viewMode === value ? 'secondary' : 'ghost'}
            size="sm"
            className={`h-7 px-3 text-xs font-medium ${
              viewMode === value
                ? 'bg-background shadow-sm'
                : 'hover:bg-background/50'
            }`}
            onClick={() => onViewModeChange(value)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Right: Status legend */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded"
            style={{ backgroundColor: STATUS_COLORS['In work'].hex }}
          />
          <span className="text-xs text-muted-foreground">In work</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded"
            style={{ backgroundColor: STATUS_COLORS.Service.hex }}
          />
          <span className="text-xs text-muted-foreground">Service</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded border border-border bg-background" />
          <span className="text-xs text-muted-foreground">Available</span>
        </div>
      </div>
    </div>
  );
}
