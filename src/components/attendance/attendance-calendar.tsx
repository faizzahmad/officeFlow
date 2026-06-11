"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  attendanceStatusLabel,
  type AttendanceCalendarDay,
} from "@/lib/attendance";
import { cn } from "@/lib/utils";

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const statusStyles = {
  present:
    "bg-emerald-500/15 text-emerald-800 hover:bg-emerald-500/20 dark:text-emerald-300",
  late: "bg-amber-500/15 text-amber-800 hover:bg-amber-500/20 dark:text-amber-300",
  half_day:
    "bg-orange-500/15 text-orange-800 hover:bg-orange-500/20 dark:text-orange-300",
  absent: "bg-red-500/15 text-red-800 hover:bg-red-500/20 dark:text-red-300",
} as const;

export function AttendanceCalendar({
  calendarData,
  month,
  year,
  teamView,
  selectedEmployeeName,
}: {
  calendarData: Record<string, AttendanceCalendarDay>;
  month: number;
  year: number;
  teamView: boolean;
  selectedEmployeeName?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const displayMonth = new Date(year, month - 1, 1);

  function onMonthChange(next: Date) {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("month", String(next.getMonth() + 1));
    nextParams.set("year", String(next.getFullYear()));
    nextParams.delete("from");
    nextParams.delete("to");
    startTransition(() => {
      router.push(`/attendance?${nextParams.toString()}`);
    });
  }

  return (
    <Card className={cn(pending && "opacity-70")}>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base">Attendance calendar</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              {teamView
                ? "Team view — present count and total hours per day"
                : selectedEmployeeName
                  ? `${selectedEmployeeName} — hours and status per day`
                  : "Your hours and status per day"}
            </p>
          </div>
          <div className="flex flex-wrap gap-1">
            {(Object.keys(statusStyles) as Array<keyof typeof statusStyles>).map(
              (status) => (
                <Badge
                  key={status}
                  variant="outline"
                  className={cn("text-[10px] font-normal", statusStyles[status])}
                >
                  {attendanceStatusLabel[status]}
                </Badge>
              ),
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex justify-center overflow-x-auto">
        <Calendar
          mode="single"
          month={displayMonth}
          onMonthChange={onMonthChange}
          className="w-full max-w-md"
          classNames={{
            month: "w-full",
            day: "h-14 w-full",
          }}
          components={{
            DayButton: ({ day, modifiers, className, ...props }) => {
              const key = toDateKey(day.date);
              const data = calendarData[key];
              const statusClass = data?.status
                ? statusStyles[data.status]
                : "";

              return (
                <button
                  type="button"
                  {...props}
                  className={cn(
                    "flex h-14 w-full flex-col items-center justify-center gap-0.5 rounded-lg border border-transparent p-1 text-xs transition-colors",
                    modifiers.outside && "opacity-40",
                    modifiers.today && "border-primary/40",
                    statusClass,
                    className,
                  )}
                >
                  <span className="text-sm font-medium leading-none">
                    {day.date.getDate()}
                  </span>
                  {data ? (
                    <span className="max-w-full truncate text-[10px] leading-tight opacity-90">
                      {teamView
                        ? `${data.presentCount} · ${data.totalHours.toFixed(1)}h`
                        : data.totalHours > 0
                          ? `${data.totalHours.toFixed(1)}h`
                          : "Present"}
                    </span>
                  ) : null}
                </button>
              );
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
