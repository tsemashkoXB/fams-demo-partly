"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({ className, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays
      className={cn("p-3", className)}
      classNames={{
        root: "w-full",
        months: "flex flex-col gap-4",
        month: "space-y-4",
        month_caption: "flex items-center justify-between",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        button_previous:
          "h-7 w-7 rounded-md border border-border bg-background p-0 text-muted-foreground hover:bg-muted",
        button_next:
          "h-7 w-7 rounded-md border border-border bg-background p-0 text-muted-foreground hover:bg-muted",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 text-center text-[0.65rem] font-medium text-muted-foreground",
        weeks: "mt-2 flex flex-col gap-1",
        week: "flex w-full",
        day: "relative h-9 w-9 text-center text-sm",
        day_button:
          "h-9 w-9 rounded-md transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary",
        day_today: "border border-primary",
        day_outside: "text-muted-foreground opacity-40",
        day_disabled: "text-muted-foreground opacity-30",
      }}
      {...props}
    />
  );
}
