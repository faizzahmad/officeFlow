"use server";

import { and, desc, eq, gte, isNotNull, isNull, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import {
  attendanceRecords,
  employees,
  user,
  workSettings,
} from "@/db/schema";
import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import {
  aggregateAttendanceCalendarDays,
  type AttendanceFilters,
  calculateWorkHours,
  determineAttendanceStatus,
  getFilterDateRange,
  getMonthDateRange,
  MAX_DAILY_CHECK_INS,
  worseAttendanceStatus,
} from "@/lib/attendance";
import { localDateString } from "@/lib/dates";
import { hasPermission, type MemberRole } from "@/lib/permissions";
import { requireWorkspace } from "@/lib/session";

export type TodayAttendanceStatus = {
  checkInCount: number;
  remainingCheckIns: number;
  canCheckIn: boolean;
  canCheckOut: boolean;
};

function buildAttendanceConditions(
  filters: AttendanceFilters,
  organizationId: string,
  memberRole: MemberRole,
  employeeId: string | null,
) {
  const { start, end } = getFilterDateRange(filters);
  const conditions = [
    eq(attendanceRecords.organizationId, organizationId),
    gte(attendanceRecords.date, start),
    lte(attendanceRecords.date, end),
  ];

  const canViewTeam = hasPermission(memberRole, "viewTeamAttendance");

  if (filters.employeeId && filters.employeeId !== "all") {
    conditions.push(eq(attendanceRecords.employeeId, filters.employeeId));
  } else if (!canViewTeam && employeeId) {
    conditions.push(eq(attendanceRecords.employeeId, employeeId));
  }

  return { conditions, canViewTeam };
}

export async function getAttendanceFilterEmployees() {
  const { organization, member } = await requireWorkspace();

  if (!hasPermission(member.role, "viewTeamAttendance")) {
    return [];
  }

  return db
    .select({
      id: employees.id,
      name: user.name,
      code: employees.employeeCode,
    })
    .from(employees)
    .innerJoin(user, eq(employees.userId, user.id))
    .where(
      and(
        eq(employees.organizationId, organization.id),
        eq(employees.isActive, true),
      ),
    )
    .orderBy(user.name);
}

export async function getTodayAttendanceStatus(): Promise<TodayAttendanceStatus | null> {
  const { employee } = await requireWorkspace();
  if (!employee) return null;

  const today = localDateString();
  const todayRecords = await db
    .select({
      checkIn: attendanceRecords.checkIn,
      checkOut: attendanceRecords.checkOut,
    })
    .from(attendanceRecords)
    .where(
      and(
        eq(attendanceRecords.employeeId, employee.id),
        eq(attendanceRecords.date, today),
        isNotNull(attendanceRecords.checkIn),
      ),
    );

  const checkInCount = todayRecords.length;
  const hasOpenSession = todayRecords.some(
    (record) => record.checkIn && !record.checkOut,
  );

  return {
    checkInCount,
    remainingCheckIns: Math.max(0, MAX_DAILY_CHECK_INS - checkInCount),
    canCheckIn: !hasOpenSession && checkInCount < MAX_DAILY_CHECK_INS,
    canCheckOut: hasOpenSession,
  };
}

export async function getAttendanceRecords(filters: AttendanceFilters) {
  const { organization, member, employee } = await requireWorkspace();
  const { conditions } = buildAttendanceConditions(
    filters,
    organization.id,
    member.role,
    employee?.id ?? null,
  );

  return db
    .select({
      record: attendanceRecords,
      employeeCode: employees.employeeCode,
      userName: user.name,
    })
    .from(attendanceRecords)
    .innerJoin(employees, eq(attendanceRecords.employeeId, employees.id))
    .innerJoin(user, eq(employees.userId, user.id))
    .where(and(...conditions))
    .orderBy(desc(attendanceRecords.date), desc(attendanceRecords.checkIn));
}

export async function getAttendanceCalendar(filters: AttendanceFilters) {
  const { organization, member, employee } = await requireWorkspace();
  const { conditions, canViewTeam } = buildAttendanceConditions(
    filters,
    organization.id,
    member.role,
    employee?.id ?? null,
  );

  const isTeamView =
    canViewTeam && (!filters.employeeId || filters.employeeId === "all");

  const rows = await db
    .select({
      employeeId: attendanceRecords.employeeId,
      date: attendanceRecords.date,
      status: attendanceRecords.status,
      workHours: attendanceRecords.workHours,
    })
    .from(attendanceRecords)
    .where(and(...conditions));

  return aggregateAttendanceCalendarDays(
    rows,
    isTeamView ? "team" : "single",
  );
}

export async function checkInWithGeoAction(
  formData: FormData,
): Promise<ActionResult> {
  const latitude = formData.get("latitude");
  const longitude = formData.get("longitude");
  return checkIn(
    latitude ? Number(latitude) : undefined,
    longitude ? Number(longitude) : undefined,
  );
}

export async function checkOutAction(): Promise<ActionResult> {
  return checkOut();
}

export async function checkIn(
  latitude?: number,
  longitude?: number,
): Promise<ActionResult> {
  const { organization, employee } = await requireWorkspace();
  if (!employee) return actionError("Employee profile not found");

  const today = localDateString();
  const todayRecords = await db
    .select({
      id: attendanceRecords.id,
      checkIn: attendanceRecords.checkIn,
      checkOut: attendanceRecords.checkOut,
    })
    .from(attendanceRecords)
    .where(
      and(
        eq(attendanceRecords.employeeId, employee.id),
        eq(attendanceRecords.date, today),
      ),
    );

  const sessionsWithCheckIn = todayRecords.filter((record) => record.checkIn);
  const openSession = sessionsWithCheckIn.find(
    (record) => !record.checkOut,
  );

  if (openSession) {
    return actionError("Check out before checking in again");
  }

  if (sessionsWithCheckIn.length >= MAX_DAILY_CHECK_INS) {
    return actionError(
      `You can only check in ${MAX_DAILY_CHECK_INS} times per day`,
    );
  }

  const now = new Date();

  await db.insert(attendanceRecords).values({
    organizationId: organization.id,
    employeeId: employee.id,
    date: today,
    checkIn: now,
    checkInLatitude: latitude?.toString(),
    checkInLongitude: longitude?.toString(),
  });

  revalidatePath("/attendance");
  return actionSuccess("Checked in successfully");
}

export async function checkOut(): Promise<ActionResult> {
  const { organization, employee } = await requireWorkspace();
  if (!employee) return actionError("Employee profile not found");

  const today = localDateString();
  const [record] = await db
    .select()
    .from(attendanceRecords)
    .where(
      and(
        eq(attendanceRecords.employeeId, employee.id),
        eq(attendanceRecords.date, today),
        isNotNull(attendanceRecords.checkIn),
        isNull(attendanceRecords.checkOut),
      ),
    )
    .orderBy(desc(attendanceRecords.checkIn))
    .limit(1);

  if (!record?.checkIn) {
    return actionError("Check in first");
  }

  const [settings] = await db
    .select()
    .from(workSettings)
    .where(eq(workSettings.organizationId, organization.id))
    .limit(1);

  const checkOutTime = new Date();
  const workHours = calculateWorkHours(record.checkIn, checkOutTime);
  const status = settings
    ? determineAttendanceStatus(record.checkIn, workHours, settings)
    : "present";

  await db
    .update(attendanceRecords)
    .set({
      checkOut: checkOutTime,
      workHours: workHours.toString(),
      status,
    })
    .where(eq(attendanceRecords.id, record.id));

  revalidatePath("/attendance");
  return actionSuccess("Checked out successfully");
}

export async function getAttendanceSummary(filters: AttendanceFilters) {
  const { organization, member, employee } = await requireWorkspace();
  const { conditions, canViewTeam } = buildAttendanceConditions(
    filters,
    organization.id,
    member.role,
    employee?.id ?? null,
  );

  const rows = await db
    .select({
      employeeId: attendanceRecords.employeeId,
      date: attendanceRecords.date,
      status: attendanceRecords.status,
    })
    .from(attendanceRecords)
    .where(and(...conditions));

  const dayStatus = new Map<string, (typeof rows)[number]["status"]>();

  for (const row of rows) {
    const key = canViewTeam
      ? `${row.employeeId}:${row.date}`
      : row.date;
    const existing = dayStatus.get(key);
    dayStatus.set(
      key,
      existing ? worseAttendanceStatus(existing, row.status) : row.status,
    );
  }

  const counts = new Map<string, number>();
  for (const status of dayStatus.values()) {
    counts.set(status, (counts.get(status) ?? 0) + 1);
  }

  return Array.from(counts.entries()).map(([status, count]) => ({
    status: status as (typeof rows)[number]["status"],
    count,
  }));
}
