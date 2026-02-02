'use client';

import * as React from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { SchedulerCalendar } from './scheduler-calendar';
import type { SchedulerFilters } from './scheduler-layout';

const VEHICLE_TYPES = ['PC', 'Pass Van', 'Van', 'CV', 'Bus'];
const STATUSES = ['In work', 'Service', 'Available'];

interface FilterPanelProps {
  filters: SchedulerFilters;
  onFiltersChange: (filters: SchedulerFilters) => void;
  onNewBooking: () => void;
  showCalendar: boolean;
  onToggleCalendar: () => void;
  onCalendarDateSelect: (date: Date) => void;
  currentDate: Date;
  onClearFilters: () => void;
}

export function FilterPanel({
  filters,
  onFiltersChange,
  onNewBooking,
  showCalendar,
  onToggleCalendar,
  onCalendarDateSelect,
  currentDate,
  onClearFilters,
}: FilterPanelProps) {
  const hasFilters =
    filters.search.trim() !== '' ||
    filters.statuses.length > 0 ||
    filters.vehicleType !== '' ||
    filters.periodStart !== '' ||
    filters.periodEnd !== '' ||
    filters.availableDuringPeriod;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const handleStatusToggle = (status: string) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const handleVehicleTypeChange = (value: string) => {
    onFiltersChange({ ...filters, vehicleType: value === 'all' ? '' : value });
  };

  const handlePeriodStartChange = (date: string) => {
    onFiltersChange({ ...filters, periodStart: date });
  };

  const handlePeriodEndChange = (date: string) => {
    onFiltersChange({ ...filters, periodEnd: date });
  };

  const handleAvailableDuringPeriodChange = (checked: boolean) => {
    onFiltersChange({ ...filters, availableDuringPeriod: checked });
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto rounded-lg border border-border bg-card p-4">
      {/* New Booking Button */}
      <Button onClick={onNewBooking} className="w-full gap-2">
        <Plus className="h-4 w-4" />
        New booking
      </Button>

      {/* Show Calendar Toggle */}
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onToggleCalendar}
        >
          {showCalendar ? 'Hide calendar' : 'Show calendar'}
        </Button>

        {showCalendar && (
          <SchedulerCalendar
            selected={currentDate}
            onSelect={onCalendarDateSelect}
          />
        )}
      </div>

      <div className="h-px bg-border" />

      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search" className="text-xs font-medium">
          Search
        </Label>
        <Input
          id="search"
          placeholder="Search by vehicle name..."
          value={filters.search}
          onChange={handleSearchChange}
          className="h-9"
        />
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Status</Label>
        <div className="flex flex-col gap-2">
          {STATUSES.map((status) => (
            <label
              key={status}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <Checkbox
                checked={filters.statuses.includes(status)}
                onCheckedChange={() => handleStatusToggle(status)}
              />
              {status}
            </label>
          ))}
        </div>
      </div>

      {/* Vehicle Type Filter */}
      <div className="space-y-2">
        <Label htmlFor="vehicle-type" className="text-xs font-medium">
          Vehicle type
        </Label>
        <Select
          value={filters.vehicleType || 'all'}
          onValueChange={handleVehicleTypeChange}
        >
          <SelectTrigger id="vehicle-type" className="h-9">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {VEHICLE_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="h-px bg-border" />

      {/* Period Filter */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Period</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">From</span>
            <DatePicker
              value={filters.periodStart}
              onChange={handlePeriodStartChange}
            />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">To</span>
            <DatePicker
              value={filters.periodEnd}
              onChange={handlePeriodEndChange}
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer pt-1">
          <Checkbox
            checked={filters.availableDuringPeriod}
            onCheckedChange={(checked) =>
              handleAvailableDuringPeriodChange(checked === true)
            }
            disabled={!filters.periodStart || !filters.periodEnd}
          />
          Available during the period
        </label>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <>
          <div className="h-px bg-border" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="w-full gap-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Clear filters
          </Button>
        </>
      )}
    </div>
  );
}
