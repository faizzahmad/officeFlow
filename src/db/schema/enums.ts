import { pgEnum } from "drizzle-orm/pg-core";

export const memberRoleEnum = pgEnum("member_role", [
  "admin",
  "hr",
  "manager",
  "employee",
]);

export const attendanceStatusEnum = pgEnum("attendance_status", [
  "present",
  "late",
  "half_day",
  "absent",
]);

export const leaveStatusEnum = pgEnum("leave_status", [
  "pending",
  "approved",
  "rejected",
  "cancelled",
]);

export const taskStatusEnum = pgEnum("task_status", [
  "pending",
  "in_progress",
  "completed",
  "cancelled",
]);

export const taskPriorityEnum = pgEnum("task_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

export const payrollStatusEnum = pgEnum("payroll_status", [
  "draft",
  "processed",
  "paid",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "task_assigned",
  "leave_update",
  "salary_generated",
  "attendance",
  "general",
]);

export const projectStatusEnum = pgEnum("project_status", [
  "planning",
  "active",
  "on_hold",
  "completed",
  "cancelled",
]);
