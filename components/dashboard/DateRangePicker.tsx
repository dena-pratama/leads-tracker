"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { addDays, format, subDays, startOfMonth, startOfWeek, subMonths } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface DateRangePickerProps {
    date: DateRange | undefined;
    setDate: (date: DateRange | undefined) => void;
    className?: string;
}

export function DateRangePicker({
    className,
    date,
    setDate
}: DateRangePickerProps) {

    const presets = [
        { label: "Today", getValue: () => ({ from: new Date(), to: new Date() }) },
        { label: "Yesterday", getValue: () => ({ from: subDays(new Date(), 1), to: subDays(new Date(), 1) }) }, // Start and end same day
        { label: "Last 7 Days", getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }) }, // Should be last 6 days + today = 7 days? Or excluding today? Usually "Last 7 days" includes today in many contexts. Meta usually means "Last 7 days" (inclusive or exclusive depending on setting). Let's go with inclusive.
        { label: "Last 30 Days", getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
        { label: "This Month", getValue: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
    ];

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[260px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <div className="flex flex-col sm:flex-row">
                        <div className="p-3 border-r h-full">
                            <div className="space-y-2">
                                <h4 className="font-medium text-xs mb-2">Presets</h4>
                                {presets.map((preset) => (
                                    <Button
                                        key={preset.label}
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start text-xs h-7"
                                        onClick={() => setDate(preset.getValue())}
                                    >
                                        {preset.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
