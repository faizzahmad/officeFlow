"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { dailyReports, employees, performanceReviews, user } from "@/db/schema";
import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import { hasPermission } from "@/lib/permissions";
import { requireWorkspace } from "@/lib/session";

export async function getDailyReports() {
  const { organization, member, employee } = await requireWorkspace();

  const conditions = [eq(dailyReports.organizationId, organization.id)];

  if (!hasPermission(member.role, "createPerformanceReview") && employee) {
    conditions.push(eq(dailyReports.employeeId, employee.id));
  }

  return db
    .select({
      report: dailyReports,
      userName: user.name,
      employeeCode: employees.employeeCode,
    })
    .from(dailyReports)
    .innerJoin(employees, eq(dailyReports.employeeId, employees.id))
    .innerJoin(user, eq(employees.userId, user.id))
    .where(and(...conditions))
    .orderBy(desc(dailyReports.date));
}

export async function submitDailyReport(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const { organization, employee } = await requireWorkspace();
  if (!employee) return actionError("Employee profile not found");

  const summary = String(formData.get("summary") ?? "").trim();
  const blockers = String(formData.get("blockers") ?? "").trim();
  const date = String(formData.get("date") ?? new Date().toISOString().slice(0, 10));

  if (!summary) return actionError("Summary is required");

  await db.insert(dailyReports).values({
    organizationId: organization.id,
    employeeId: employee.id,
    date,
    summary,
    blockers: blockers || null,
  });

  revalidatePath("/performance");
  return actionSuccess("Daily report submitted");
}

export async function getPerformanceReviews() {
  const { organization, member, employee } = await requireWorkspace();

  const conditions = [eq(performanceReviews.organizationId, organization.id)];

  if (!hasPermission(member.role, "createPerformanceReview") && employee) {
    conditions.push(eq(performanceReviews.employeeId, employee.id));
  }

  return db
    .select({
      review: performanceReviews,
      userName: user.name,
      employeeCode: employees.employeeCode,
    })
    .from(performanceReviews)
    .innerJoin(employees, eq(performanceReviews.employeeId, employees.id))
    .innerJoin(user, eq(employees.userId, user.id))
    .where(and(...conditions))
    .orderBy(desc(performanceReviews.createdAt));
}

export async function createPerformanceReview(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const { organization, employee, member } = await requireWorkspace();

  if (!["admin", "hr", "manager"].includes(member.role)) {
    return actionError("You do not have permission to create reviews");
  }

  const employeeId = String(formData.get("employeeId") ?? "");
  const period = String(formData.get("period") ?? "").trim();
  const score = Number(formData.get("score"));
  const feedback = String(formData.get("feedback") ?? "").trim();

  if (!employeeId || !period || !score) {
    return actionError("Employee, period, and score are required");
  }

  await db.insert(performanceReviews).values({
    organizationId: organization.id,
    employeeId,
    reviewerId: employee?.id ?? null,
    period,
    score,
    feedback: feedback || null,
  });

  revalidatePath("/performance");
  return actionSuccess("Performance review saved");
}
