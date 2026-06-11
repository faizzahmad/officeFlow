"use server";

import { and, desc, eq, gte, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import {
  attendanceRecords,
  employees,
  payrollRuns,
  payslips,
  user,
} from "@/db/schema";
import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import { getMonthDateRange } from "@/lib/attendance";
import { toActionDbError } from "@/lib/db-error";
import { notifyUser } from "@/lib/notify";
import {
  calculateNetSalary,
  generateSlipNumber,
} from "@/lib/payroll";
import { hasPermission } from "@/lib/permissions";
import { revalidateNotificationViews } from "@/lib/revalidate-notifications";
import { requireWorkspace } from "@/lib/session";

type EmployeeRow = typeof employees.$inferSelect;

async function createPayslipForEmployee({
  organizationId,
  payrollRunId,
  employee,
  month,
  year,
}: {
  organizationId: string;
  payrollRunId: string;
  employee: EmployeeRow;
  month: number;
  year: number;
}) {
  const { start, end } = getMonthDateRange(month, year);

  const lateDays = await db
    .select({ id: attendanceRecords.id })
    .from(attendanceRecords)
    .where(
      and(
        eq(attendanceRecords.employeeId, employee.id),
        eq(attendanceRecords.status, "late"),
        gte(attendanceRecords.date, start),
        lte(attendanceRecords.date, end),
      ),
    );

  const baseSalary = Number(employee.baseSalary);
  const lateDeduction = lateDays.length * (baseSalary * 0.01);
  const netSalary = calculateNetSalary({
    baseSalary,
    lateDeduction,
  });

  await db.insert(payslips).values({
    organizationId,
    payrollRunId,
    employeeId: employee.id,
    baseSalary: employee.baseSalary,
    lateDeduction: lateDeduction.toString(),
    netSalary: netSalary.toString(),
    slipNumber: generateSlipNumber(year, month, employee.employeeCode),
  });

  await notifyUser({
    organizationId,
    userId: employee.userId,
    type: "salary_generated",
    title: "Salary slip ready",
    message: `Your salary slip for ${month}/${year} is available for download.`,
    link: "/payroll",
    emailSubject: `Salary slip for ${month}/${year}`,
    emailBody: `Your payslip for ${month}/${year} has been generated. Log in to Office Flow to view and download the PDF.`,
  });
}

export async function getPayrollRuns() {
  const { organization } = await requireWorkspace();

  return db
    .select()
    .from(payrollRuns)
    .where(eq(payrollRuns.organizationId, organization.id))
    .orderBy(desc(payrollRuns.year), desc(payrollRuns.month));
}

export async function getPayslips(payrollRunId?: string) {
  const { organization, member, employee } = await requireWorkspace();

  const conditions = [eq(payslips.organizationId, organization.id)];
  if (payrollRunId) {
    conditions.push(eq(payslips.payrollRunId, payrollRunId));
  }
  if (!hasPermission(member.role, "viewAllPayslips") && employee) {
    conditions.push(eq(payslips.employeeId, employee.id));
  }

  return db
    .select({
      payslip: payslips,
      employeeCode: employees.employeeCode,
      userName: user.name,
    })
    .from(payslips)
    .innerJoin(employees, eq(payslips.employeeId, employees.id))
    .innerJoin(user, eq(employees.userId, user.id))
    .where(and(...conditions))
    .orderBy(desc(payslips.createdAt));
}

export async function generatePayroll(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const { organization, member } = await requireWorkspace();

  if (!["admin", "hr"].includes(member.role)) {
    return actionError("You do not have permission to generate payroll");
  }

  const employeeId = String(formData.get("employeeId") ?? "").trim();
  const month = Number(formData.get("month"));
  const year = Number(formData.get("year"));

  if (!employeeId || !month || !year) {
    return actionError("Employee, month, and year are required");
  }

  if (month < 1 || month > 12) {
    return actionError("Please select a valid month");
  }

  const orgEmployees = await db
    .select()
    .from(employees)
    .where(
      and(
        eq(employees.organizationId, organization.id),
        eq(employees.isActive, true),
      ),
    );

  const targets =
    employeeId === "all"
      ? orgEmployees
      : orgEmployees.filter((row) => row.id === employeeId);

  if (targets.length === 0) {
    return actionError("Please select a valid employee");
  }

  try {
    let [run] = await db
      .select()
      .from(payrollRuns)
      .where(
        and(
          eq(payrollRuns.organizationId, organization.id),
          eq(payrollRuns.month, month),
          eq(payrollRuns.year, year),
        ),
      )
      .limit(1);

    if (!run) {
      [run] = await db
        .insert(payrollRuns)
        .values({
          organizationId: organization.id,
          month,
          year,
          status: "processed",
          processedAt: new Date(),
        })
        .returning();
    }

    let created = 0;

    for (const employee of targets) {
      const [existingSlip] = await db
        .select({ id: payslips.id })
        .from(payslips)
        .where(
          and(
            eq(payslips.payrollRunId, run.id),
            eq(payslips.employeeId, employee.id),
          ),
        )
        .limit(1);

      if (existingSlip) continue;

      await createPayslipForEmployee({
        organizationId: organization.id,
        payrollRunId: run.id,
        employee,
        month,
        year,
      });
      created += 1;
    }

    if (created === 0) {
      return actionError(
        employeeId === "all"
          ? "Salary slips already exist for all employees in this period"
          : "A salary slip already exists for this employee and period",
      );
    }

    revalidatePath("/payroll");
    revalidateNotificationViews();

    const label =
      employeeId === "all"
        ? `${created} salary slip(s) generated for ${month}/${year}`
        : `Salary slip generated for ${month}/${year}`;

    return actionSuccess(label);
  } catch (error) {
    return toActionDbError(error);
  }
}
