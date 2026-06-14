import { differenceInMinutes } from "date-fns";

import type { attendanceRecords } from "@/db/schema";

/** Inclusive YYYY-MM-DD range for a calendar month (handles Feb, 30-day months, etc.). */
export function getMonthDateRange(month: number, year: number) {
  const monthStr = String(month).padStart(2, "0");
  const start = `${year}-${monthStr}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const end = `${year}-${monthStr}-${String(lastDay).padStart(2, "0")}`;
  return { start, end };
}

type AttendanceRecord = typeof attendanceRecords.$inferSelect;

type WorkSettings = {
  workStartHour: number;
  workStartMinute: number;
  workEndHour: number;
  workEndMinute: number;
  lateGraceMinutes: number;
  halfDayHours: string;
};

export function calculateWorkHours(
  checkIn: Date,
  checkOut: Date,
): number {
  const minutes = differenceInMinutes(checkOut, checkIn);
  return Math.max(0, Math.round((minutes / 60) * 100) / 100);
}

export function determineAttendanceStatus(
  checkIn: Date,
  workHours: number,
  settings: WorkSettings,
): AttendanceRecord["status"] {
  const scheduledStart = new Date(checkIn);
  scheduledStart.setHours(
    settings.workStartHour,
    settings.workStartMinute,
    0,
    0,
  );

  const lateMinutes = differenceInMinutes(checkIn, scheduledStart);
  const halfDayThreshold = Number(settings.halfDayHours);

  if (workHours < halfDayThreshold) {
    return "half_day";
  }

  if (lateMinutes > settings.lateGraceMinutes) {
    return "late";
  }

  return "present";
}

export const MAX_DAILY_CHECK_INS = 3;

const statusPriority: Record<AttendanceRecord["status"], number> = {
  absent: 0,
  half_day: 1,
  late: 2,
  present: 3,
};

export function worseAttendanceStatus(
  current: AttendanceRecord["status"],
  next: AttendanceRecord["status"],
): AttendanceRecord["status"] {
  return statusPriority[next] < statusPriority[current] ? next : current;
}

export function formatWorkHours(hours: string | number | null): string {
  if (hours === null) return "—";
  const value = typeof hours === "string" ? Number(hours) : hours;
  return `${value.toFixed(1)}h`;
}

export type AttendanceFilters = {
  month: number;
  year: number;
  employeeId?: string;
  startDate?: string;
  endDate?: string;
};

export type AttendanceCalendarDay = {
  date: string;
  totalHours: number;
  status: AttendanceRecord["status"] | null;
  presentCount: number;
  sessionCount: number;
};

export function parseAttendanceFilters(
  params: Record<string, string | string[] | undefined>,
  defaults: { month: number; year: number; employeeId?: string },
): AttendanceFilters {
  const month = Number(params.month) || defaults.month;
  const year = Number(params.year) || defaults.year;
  const employeeId =
    typeof params.employee === "string" && params.employee
      ? params.employee
      : defaults.employeeId;
  const startDate =
    typeof params.from === "string" && params.from ? params.from : undefined;
  const endDate =
    typeof params.to === "string" && params.to ? params.to : undefined;

  return { month, year, employeeId, startDate, endDate };
}

export function getFilterDateRange(filters: AttendanceFilters) {
  if (filters.startDate && filters.endDate) {
    return { start: filters.startDate, end: filters.endDate };
  }
  return getMonthDateRange(filters.month, filters.year);
}

export function aggregateAttendanceCalendarDays(
  rows: Array<{
    employeeId: string;
    date: string;
    status: AttendanceRecord["status"];
    workHours: string | null;
  }>,
  mode: "single" | "team",
): Record<string, AttendanceCalendarDay> {
  const byDate = new Map<
    string,
    {
      totalHours: number;
      status: AttendanceRecord["status"] | null;
      employees: Set<string>;
      sessionCount: number;
    }
  >();

  for (const row of rows) {
    const hours = row.workHours ? Number(row.workHours) : 0;
    const bucket = byDate.get(row.date) ?? {
      totalHours: 0,
      status: null,
      employees: new Set<string>(),
      sessionCount: 0,
    };

    bucket.totalHours = Math.round((bucket.totalHours + hours) * 100) / 100;
    bucket.sessionCount += 1;
    bucket.employees.add(row.employeeId);
    bucket.status = bucket.status
      ? worseAttendanceStatus(bucket.status, row.status)
      : row.status;

    byDate.set(row.date, bucket);
  }

  const result: Record<string, AttendanceCalendarDay> = {};
  for (const [date, bucket] of byDate) {
    result[date] = {
      date,
      totalHours: bucket.totalHours,
      status: bucket.status,
      presentCount: mode === "team" ? bucket.employees.size : 1,
      sessionCount: bucket.sessionCount,
    };
  }

  return result;
}

export const attendanceStatusLabel: Record<AttendanceRecord["status"], string> =
  {
    present: "Present",
    late: "Late",
    half_day: "Half day",
    absent: "Absent",
  };

export const attendanceStatusStyles: Record<
  AttendanceRecord["status"],
  string
> = {
  present:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  late: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  half_day:
    "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-300",
  absent: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
};

export const attendanceCalendarDayStyles: Record<
  AttendanceRecord["status"],
  string
> = {
  present:
    "bg-emerald-500/15 text-emerald-800 hover:bg-emerald-500/20 dark:text-emerald-300",
  late: "bg-amber-500/15 text-amber-800 hover:bg-amber-500/20 dark:text-amber-300",
  half_day:
    "bg-orange-500/15 text-orange-800 hover:bg-orange-500/20 dark:text-orange-300",
  absent: "bg-red-500/15 text-red-800 hover:bg-red-500/20 dark:text-red-300",
};

export function formatAttendanceDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatAttendanceTime(value: Date | string | null): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatAttendancePeriod(filters: AttendanceFilters): string {
  if (filters.startDate && filters.endDate) {
    return `${formatAttendanceDate(filters.startDate)} – ${formatAttendanceDate(filters.endDate)}`;
  }

  const monthLabel = new Date(
    filters.year,
    filters.month - 1,
    1,
  ).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return monthLabel;
}

export function getAttendanceMapLink(
  latitude: string | null,
  longitude: string | null,
): string | null {
  if (!latitude || !longitude) return null;
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}
