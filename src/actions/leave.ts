"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import {
  employees,
  leaveBalances,
  leaveRequests,
  leaveTypes,
  user,
} from "@/db/schema";
import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import { localDateString } from "@/lib/dates";
import { toActionDbError } from "@/lib/db-error";
import { hasPermission } from "@/lib/permissions";
import { revalidateNotificationViews } from "@/lib/revalidate-notifications";
import { notifyRoles, notifyUser } from "@/lib/notify";
import { requireWorkspace } from "@/lib/session";

function daysBetween(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = endDate.getTime() - startDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

export async function getLeaveRequests() {
  const { organization, member, employee } = await requireWorkspace();

  const conditions = [eq(leaveRequests.organizationId, organization.id)];

  if (!hasPermission(member.role, "approveLeave") && employee) {
    conditions.push(eq(leaveRequests.employeeId, employee.id));
  }

  return db
    .select({
      request: leaveRequests,
      employeeCode: employees.employeeCode,
      userName: user.name,
      leaveType: leaveTypes.name,
    })
    .from(leaveRequests)
    .innerJoin(employees, eq(leaveRequests.employeeId, employees.id))
    .innerJoin(user, eq(employees.userId, user.id))
    .innerJoin(leaveTypes, eq(leaveRequests.leaveTypeId, leaveTypes.id))
    .where(and(...conditions))
    .orderBy(desc(leaveRequests.createdAt));
}

export async function getLeaveTypes() {
  const { organization } = await requireWorkspace();
  return db
    .select()
    .from(leaveTypes)
    .where(eq(leaveTypes.organizationId, organization.id));
}

export async function getLeaveBalances() {
  const { organization, member, employee } = await requireWorkspace();
  const year = new Date().getFullYear();

  const conditions = [
    eq(leaveBalances.organizationId, organization.id),
    eq(leaveBalances.year, year),
  ];

  if (!hasPermission(member.role, "approveLeave") && employee) {
    conditions.push(eq(leaveBalances.employeeId, employee.id));
  }

  return db
    .select({
      balance: leaveBalances,
      leaveType: leaveTypes.name,
      userName: user.name,
      employeeCode: employees.employeeCode,
    })
    .from(leaveBalances)
    .innerJoin(leaveTypes, eq(leaveBalances.leaveTypeId, leaveTypes.id))
    .innerJoin(employees, eq(leaveBalances.employeeId, employees.id))
    .innerJoin(user, eq(employees.userId, user.id))
    .where(and(...conditions));
}

export async function applyLeave(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const { organization, employee, session } = await requireWorkspace();
  if (!employee) return actionError("Employee profile not found");

  const leaveTypeId = String(formData.get("leaveTypeId") ?? "");
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();

  if (!leaveTypeId || !startDate || !endDate) {
    return actionError("Leave type and dates are required");
  }

  const today = localDateString();
  if (startDate < today || endDate < today) {
    return actionError("Leave can only be applied for today or future dates");
  }

  const days = daysBetween(startDate, endDate);
  if (days <= 0) return actionError("End date must be on or after start date");

  const [leaveType] = await db
    .select({ id: leaveTypes.id })
    .from(leaveTypes)
    .where(
      and(
        eq(leaveTypes.id, leaveTypeId),
        eq(leaveTypes.organizationId, organization.id),
      ),
    )
    .limit(1);

  if (!leaveType) {
    return actionError("Please select a valid leave type");
  }

  try {
    await db.insert(leaveRequests).values({
      organizationId: organization.id,
      employeeId: employee.id,
      leaveTypeId,
      startDate,
      endDate,
      days,
      reason: reason || null,
    });
  } catch (error) {
    return toActionDbError(error);
  }

  try {
    await notifyRoles({
      organizationId: organization.id,
      roles: ["admin", "hr", "manager"],
      type: "leave_update",
      title: "New leave request",
      message: `${session.user.name} applied for ${days} day(s) of leave.`,
      link: "/leave",
      emailSubject: "New leave request pending approval",
      emailBody: `${session.user.name} submitted a leave request from ${startDate} to ${endDate}. Please review it in Office Flow.`,
    });
  } catch (error) {
    console.error("[leave] notification failed", error);
  }

  revalidatePath("/leave");
  return actionSuccess("Leave request submitted");
}

export async function reviewLeave(
  requestId: string,
  status: "approved" | "rejected",
  note?: string,
): Promise<ActionResult> {
  const { organization, session, member } = await requireWorkspace();

  if (!["admin", "hr", "manager"].includes(member.role)) {
    return actionError("Not authorized");
  }

  const [request] = await db
    .select()
    .from(leaveRequests)
    .where(
      and(
        eq(leaveRequests.id, requestId),
        eq(leaveRequests.organizationId, organization.id),
      ),
    )
    .limit(1);

  if (!request) return actionError("Leave request not found");
  if (request.status !== "pending") return actionError("Already reviewed");

  await db
    .update(leaveRequests)
    .set({
      status,
      reviewedBy: session.user.id,
      reviewNote: note ?? null,
      reviewedAt: new Date(),
    })
    .where(eq(leaveRequests.id, requestId));

  if (status === "approved") {
    const year = new Date(request.startDate).getFullYear();
    const [balance] = await db
      .select()
      .from(leaveBalances)
      .where(
        and(
          eq(leaveBalances.employeeId, request.employeeId),
          eq(leaveBalances.leaveTypeId, request.leaveTypeId),
          eq(leaveBalances.year, year),
        ),
      )
      .limit(1);

    if (balance) {
      await db
        .update(leaveBalances)
        .set({ usedDays: balance.usedDays + request.days })
        .where(eq(leaveBalances.id, balance.id));
    } else {
      const [type] = await db
        .select()
        .from(leaveTypes)
        .where(eq(leaveTypes.id, request.leaveTypeId))
        .limit(1);

      await db.insert(leaveBalances).values({
        organizationId: organization.id,
        employeeId: request.employeeId,
        leaveTypeId: request.leaveTypeId,
        year,
        totalDays: type?.defaultDays ?? 0,
        usedDays: request.days,
      });
    }
  }

  const [employeeRow] = await db
    .select({ userId: employees.userId })
    .from(employees)
    .where(eq(employees.id, request.employeeId))
    .limit(1);

  if (employeeRow) {
    await notifyUser({
      organizationId: organization.id,
      userId: employeeRow.userId,
      type: "leave_update",
      title: `Leave ${status}`,
      message: `Your leave request has been ${status}.`,
      link: "/leave",
      emailSubject: `Leave request ${status}`,
      emailBody: `Your leave request has been <strong>${status}</strong>.`,
    });
  }

  revalidatePath("/leave");
  revalidateNotificationViews();
  return actionSuccess(
    status === "approved" ? "Leave request approved" : "Leave request rejected",
  );
}
