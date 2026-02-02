'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SchedulerCalendarProps {
  selected?: Date;
  onSelect: (date: Date) => void;
}

/**
 * Calendar component styled according to Figma design (node-id=1-92)
 *
 * Design tokens:
 * - Container: 8px border radius, 24px padding, gradient background with blur
 * - Border: 2px gradient stroke
 * - Day header: 10px uppercase semibold, letter-spacing 15%, #828282 (Gray 3)
 * - Date font: 16px semibold
 * - Inactive date: #4A5660 (Gray 80)
 * - Active date: #2F6FED background, white text
 * - Month title: 14px semibold, #333333 (Gray 1)
 * - Gap between rows: 8px
 * - Cell size: 30x30px
 */
export function SchedulerCalendar({
  selected,
  onSelect,
}: SchedulerCalendarProps) {
  const [month, setMonth] = React.useState(selected ?? new Date());

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onSelect(date);
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-lg p-3"
      style={{
        background:
          'radial-gradient(circle at 15% 21%, rgba(224, 249, 255, 0.2) 0%, rgba(110, 191, 244, 0.04) 77%, rgba(70, 144, 212, 0) 100%)',
        backdropFilter: 'blur(80px)',
        boxShadow: '2px 16px 19px 0px rgba(0, 0, 0, 0.09)',
      }}
    >
      {/* Gradient border overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-lg"
        style={{
          padding: '2px',
          background:
            'radial-gradient(circle at -14% -12%, rgba(47, 111, 237, 1) 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(circle at 108% 113%, rgba(47, 111, 237, 1) 0%, rgba(47, 111, 237, 0) 100%)',
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={handleSelect}
        month={month}
        onMonthChange={setMonth}
        showOutsideDays={false}
        weekStartsOn={0}
        classNames={{
          root: 'w-full',
          months: 'flex flex-col gap-3',
          month: 'flex flex-col gap-2',
          month_caption: 'flex justify-between items-center',
          caption_label: 'text-[13px] font-semibold text-[#333333]',
          nav: 'flex items-center gap-0.5',
          button_previous: cn(
            'h-5 w-5 bg-transparent p-0 opacity-70 hover:opacity-100',
            'inline-flex items-center justify-center rounded-md',
            'transition-opacity cursor-pointer border-0',
          ),
          button_next: cn(
            'h-5 w-5 bg-transparent p-0 opacity-70 hover:opacity-100',
            'inline-flex items-center justify-center rounded-md',
            'transition-opacity cursor-pointer border-0',
          ),
          month_grid: 'w-full border-collapse',
          weekdays: 'flex justify-between',
          weekday: cn(
            'w-[30px] text-[9px] font-semibold uppercase tracking-[0.1em] text-[#828282]',
            'flex items-center justify-center',
          ),
          weeks: 'flex flex-col gap-1',
          week: 'flex justify-between',
          day: cn(
            'relative h-[30px] w-[30px] p-0 text-center',
            'focus-within:relative focus-within:z-20',
          ),
          day_button: cn(
            'h-[30px] w-[30px] p-0 text-[14px] font-semibold text-[#4A5660]',
            'flex items-center justify-center rounded-full',
            'hover:bg-[#2F6FED]/10 hover:text-[#2F6FED]',
            'focus:outline-none focus-visible:outline-none',
            'transition-colors cursor-pointer border-0 bg-transparent',
          ),
          selected: cn(
            '[&>button]:bg-[#2F6FED] [&>button]:text-white [&>button]:rounded-full',
            '[&>button:hover]:bg-[#2F6FED] [&>button:hover]:text-white',
          ),
          today: 'border border-[#2F6FED] rounded-full text-[#2F6FED]',
          outside: 'text-[#828282] opacity-50',
          disabled: 'text-[#828282] opacity-30 cursor-not-allowed',
          hidden: 'invisible',
        }}
        components={{
          Chevron: ({ orientation }) =>
            orientation === 'left' ? (
              <ChevronLeft className="h-3.5 w-3.5 text-[#333333]" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-[#333333]" />
            ),
        }}
        formatters={{
          formatCaption: (date) => format(date, 'MMMM yyyy'),
          formatWeekdayName: (date) =>
            format(date, 'EEE').toUpperCase().slice(0, 3),
        }}
      />
    </div>
  );
}
