"use server";

import { and, desc, eq, gte, or, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  attendanceRecords,
  employees,
  leaveRequests,
  notifications,
  tasks,
  user,
} from "@/db/schema";
import { hasPermission } from "@/lib/permissions";
import { requireWorkspace } from "@/lib/session";
import { taskVisibilityCondition } from "@/lib/task-access";

function lastNDays(n: number) {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().slice(0, 10));
  }
  return days;
}

function formatDayLabel(dateStr: string) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
  });
}

export async function getDashboardStats() {
  const { organization, member, employee } = await requireWorkspace();
  const isTeamView = hasPermission(member.role, "viewTeamAttendance");
  const monthStart = new Date();
  monthStart.setDate(1);
  const monthStartStr = monthStart.toISOString().slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);

  const [employeeCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(employees)
    .where(
      and(
        eq(employees.organizationId, organization.id),
        eq(employees.isActive, true),
      ),
    );

  const leaveConditions = [
    eq(leaveRequests.organizationId, organization.id),
    eq(leaveRequests.status, "pending"),
  ];
  if (!isTeamView && employee) {
    leaveConditions.push(eq(leaveRequests.employeeId, employee.id));
  }

  const [pendingLeaves] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(leaveRequests)
    .where(and(...leaveConditions));

  const taskConditions = [eq(tasks.organizationId, organization.id)];
  if (!isTeamView && employee) {
    taskConditions.push(taskVisibilityCondition(employee.id)!);
  }

  const taskRows = await db
    .select({ status: tasks.status })
    .from(tasks)
    .where(and(...taskConditions));

  const completedTasks = taskRows.filter((t) => t.status === "completed").length;
  const inProgressTasks = taskRows.filter(
    (t) => t.status === "in_progress",
  ).length;
  const pendingTasks = taskRows.filter((t) => t.status === "pending").length;
  const taskCompletion =
    taskRows.length > 0
      ? Math.round((completedTasks / taskRows.length) * 100)
      : 0;

  const attendanceTodayConditions = [
    eq(attendanceRecords.organizationId, organization.id),
    eq(attendanceRecords.date, today),
  ];
  const lateMonthConditions = [
    eq(attendanceRecords.organizationId, organization.id),
    eq(attendanceRecords.status, "late"),
    gte(attendanceRecords.date, monthStartStr),
  ];

  if (!isTeamView && employee) {
    attendanceTodayConditions.push(eq(attendanceRecords.employeeId, employee.id));
    lateMonthConditions.push(eq(attendanceRecords.employeeId, employee.id));
  }

  const [presentToday] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(attendanceRecords)
    .where(and(...attendanceTodayConditions));

  const [lateThisMonth] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(attendanceRecords)
    .where(and(...lateMonthConditions));

  const attendanceRate = isTeamView
    ? (employeeCount?.count ?? 0) > 0
      ? Math.round(
          ((presentToday?.count ?? 0) / (employeeCount?.count ?? 1)) * 100,
        )
      : 0
    : (presentToday?.count ?? 0) > 0
      ? 100
      : 0;

  return {
    viewMode: isTeamView ? ("team" as const) : ("personal" as const),
    employees: employeeCount?.count ?? 0,
    pendingLeaves: pendingLeaves?.count ?? 0,
    taskCompletion,
    presentToday: presentToday?.count ?? 0,
    lateThisMonth: lateThisMonth?.count ?? 0,
    totalTasks: taskRows.length,
    completedTasks,
    inProgressTasks,
    pendingTasks,
    attendanceRate,
  };
}

export async function getDashboardCharts() {
  const { organization, member, employee } = await requireWorkspace();
  const isTeamView = hasPermission(member.role, "viewTeamAttendance");
  const days = lastNDays(7);
  const startDate = days[0];

  const attendanceConditions = [
    eq(attendanceRecords.organizationId, organization.id),
    gte(attendanceRecords.date, startDate),
  ];
  if (!isTeamView && employee) {
    attendanceConditions.push(eq(attendanceRecords.employeeId, employee.id));
  }

  const attendanceRows = await db
    .select({
      date: attendanceRecords.date,
      status: attendanceRecords.status,
    })
    .from(attendanceRecords)
    .where(and(...attendanceConditions));

  const attendanceTrend = days.map((date) => {
    const dayRows = attendanceRows.filter((row) => row.date === date);
    return {
      day: formatDayLabel(date),
      present: dayRows.filter(
        (r) => r.status === "present" || r.status === "late",
      ).length,
      late: dayRows.filter((r) => r.status === "late").length,
      absent: 0,
    };
  });

  const taskChartConditions = [eq(tasks.organizationId, organization.id)];
  if (!isTeamView && employee) {
    taskChartConditions.push(taskVisibilityCondition(employee.id)!);
  }

  const taskRows = await db
    .select({ status: tasks.status })
    .from(tasks)
    .where(and(...taskChartConditions));

  const taskBreakdown = [
    { status: "pending", label: "Pending", count: 0 },
    { status: "in_progress", label: "In Progress", count: 0 },
    { status: "completed", label: "Completed", count: 0 },
    { status: "cancelled", label: "Cancelled", count: 0 },
  ].map((item) => ({
    ...item,
    count: taskRows.filter((t) => t.status === item.status).length,
  }));

  const monthStart = new Date();
  monthStart.setDate(1);
  const monthAttendanceConditions = [
    eq(attendanceRecords.organizationId, organization.id),
    gte(attendanceRecords.date, monthStart.toISOString().slice(0, 10)),
  ];
  if (!isTeamView && employee) {
    monthAttendanceConditions.push(eq(attendanceRecords.employeeId, employee.id));
  }

  const attendanceStatusRows = await db
    .select({
      status: attendanceRecords.status,
      count: sql<number>`count(*)::int`,
    })
    .from(attendanceRecords)
    .where(and(...monthAttendanceConditions))
    .groupBy(attendanceRecords.status);

  const attendanceBreakdown = attendanceStatusRows.map((row) => ({
    status: row.status,
    label: row.status.replace("_", " "),
    count: row.count,
  }));

  const leaveChartConditions = [eq(leaveRequests.organizationId, organization.id)];
  if (!isTeamView && employee) {
    leaveChartConditions.push(eq(leaveRequests.employeeId, employee.id));
  }

  const leaveStatusRows = await db
    .select({
      status: leaveRequests.status,
      count: sql<number>`count(*)::int`,
    })
    .from(leaveRequests)
    .where(and(...leaveChartConditions))
    .groupBy(leaveRequests.status);

  const leaveBreakdown = leaveStatusRows.map((row) => ({
    status: row.status,
    label: row.status,
    count: row.count,
  }));

  return {
    attendanceTrend,
    taskBreakdown,
    attendanceBreakdown,
    leaveBreakdown,
  };
}

export async function getRecentActivity() {
  const { organization, session, member, employee } = await requireWorkspace();
  const isTeamView = hasPermission(member.role, "viewTeamAttendance");

  const recentTaskConditions = [eq(tasks.organizationId, organization.id)];
  if (!isTeamView && employee) {
    recentTaskConditions.push(taskVisibilityCondition(employee.id)!);
  }

  const recentTasks = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      status: tasks.status,
      createdAt: tasks.createdAt,
    })
    .from(tasks)
    .where(and(...recentTaskConditions))
    .orderBy(desc(tasks.createdAt))
    .limit(4);

  const recentLeaveConditions = [eq(leaveRequests.organizationId, organization.id)];
  if (!isTeamView && employee) {
    recentLeaveConditions.push(eq(leaveRequests.employeeId, employee.id));
  }

  const recentLeaves = await db
    .select({
      id: leaveRequests.id,
      status: leaveRequests.status,
      days: leaveRequests.days,
      createdAt: leaveRequests.createdAt,
      userName: user.name,
    })
    .from(leaveRequests)
    .innerJoin(employees, eq(leaveRequests.employeeId, employees.id))
    .innerJoin(user, eq(employees.userId, user.id))
    .where(and(...recentLeaveConditions))
    .orderBy(desc(leaveRequests.createdAt))
    .limit(4);

  const recentNotifications = await db
    .select()
    .from(notifications)
    .where(
      and(
        eq(notifications.organizationId, organization.id),
        eq(notifications.userId, session.user.id),
      ),
    )
    .orderBy(desc(notifications.createdAt))
    .limit(5);

  return { recentTasks, recentLeaves, recentNotifications };
}
