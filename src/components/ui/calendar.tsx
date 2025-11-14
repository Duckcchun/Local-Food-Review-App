"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react@0.487.0";
import { DayPicker } from "react-day-picker@8.10.1";

import { cn } from "./utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
  caption_label: "text-sm font-medium text-[#2d3e2d]",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          // Tailwind v4 build here is missing the `size-*` utilities, so use explicit width/height
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        // Use grid to guarantee 7 equal columns even if some utilities are purged
        head_row: "grid grid-cols-7",
        head_cell:
          "rounded-md w-8 font-normal text-[0.7rem] text-[#6b8e6f] tracking-tight",
        row: "grid grid-cols-7 w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-[#e5f9f3] [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100 text-[#2d3e2d] hover:bg-[#f5f0dc] rounded-full transition-colors",
        ),
        day_range_start:
          "day-range-start aria-selected:bg-[#6b8e6f] aria-selected:text-white",
        day_range_end:
          "day-range-end aria-selected:bg-[#6b8e6f] aria-selected:text-white",
        day_selected:
          "bg-[#6b8e6f] text-white hover:bg-[#5a7a5e] focus:bg-[#5a7a5e]",
        day_today: "border border-[#6b8e6f] text-[#2d3e2d]",
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-[#e5f9f3] aria-selected:text-[#2d3e2d]",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
