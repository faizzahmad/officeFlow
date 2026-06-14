"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { AttendanceStatusBadge } from "@/components/attendance/attendance-status-badge";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  attendanceCalendarDayStyles,
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
  const monthDays = Object.values(calendarData);
  const totalHours = monthDays.reduce((sum, day) => sum + day.totalHours, 0);
  const daysWithData = monthDays.length;

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

  function dayLabel(data: AttendanceCalendarDay) {
    if (teamView) {
      return `${data.presentCount} present`;
    }

    if (data.totalHours > 0) {
      return `${data.totalHours.toFixed(1)}h`;
    }

    return attendanceStatusLabel[data.status ?? "present"];
  }

  return (
    <Card className={cn("h-full", pending && "opacity-70")}>
      <CardHeader className="space-y-3 pb-3">
        <div>
          <CardTitle className="text-base">Calendar overview</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {teamView
              ? "Daily team attendance at a glance"
              : selectedEmployeeName
                ? `${selectedEmployeeName}'s attendance`
                : "Your daily attendance"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/30 p-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Days tracked</p>
            <p className="font-medium">{daysWithData}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total hours</p>
            <p className="font-medium">{totalHours.toFixed(1)}h</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(
            Object.keys(attendanceCalendarDayStyles) as Array<
              keyof typeof attendanceCalendarDayStyles
            >
          ).map((status) => (
            <AttendanceStatusBadge
              key={status}
              status={status}
              className="text-[11px]"
            />
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex justify-center overflow-x-auto pb-6">
        <Calendar
          mode="single"
          month={displayMonth}
          onMonthChange={onMonthChange}
          className="w-full"
          classNames={{
            month: "w-full",
            day: "h-16 w-full",
          }}
          components={{
            DayButton: ({ day, modifiers, className, ...props }) => {
              const key = toDateKey(day.date);
              const data = calendarData[key];
              const statusClass = data?.status
                ? attendanceCalendarDayStyles[data.status]
                : "";

              return (
                <button
                  type="button"
                  {...props}
                  className={cn(
                    "flex h-16 w-full flex-col items-center justify-center gap-1 rounded-lg border border-transparent p-1 text-xs transition-colors",
                    modifiers.outside && "opacity-40",
                    modifiers.today && "ring-2 ring-primary/30",
                    statusClass,
                    className,
                  )}
                >
                  <span className="text-sm font-semibold leading-none">
                    {day.date.getDate()}
                  </span>
                  {data ? (
                    <span className="max-w-full truncate px-0.5 text-[10px] leading-tight opacity-90">
                      {dayLabel(data)}
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
