import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import {
  employees,
  organizations,
  payrollRuns,
  payslips,
  user,
} from "@/db/schema";
import { generatePayslipPdf } from "@/lib/payslip-pdf";
import { hasPermission } from "@/lib/permissions";
import { getSession, getWorkspace } from "@/lib/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workspace = await getWorkspace(session.user.id);
  if (!workspace) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { organization, member, employee } = workspace;

  const [row] = await db
    .select({
      payslip: payslips,
      employeeCode: employees.employeeCode,
      employeeId: employees.id,
      userName: user.name,
      organizationName: organizations.name,
      month: payrollRuns.month,
      year: payrollRuns.year,
    })
    .from(payslips)
    .innerJoin(employees, eq(payslips.employeeId, employees.id))
    .innerJoin(user, eq(employees.userId, user.id))
    .innerJoin(organizations, eq(payslips.organizationId, organizations.id))
    .innerJoin(payrollRuns, eq(payslips.payrollRunId, payrollRuns.id))
    .where(
      and(eq(payslips.id, id), eq(payslips.organizationId, organization.id)),
    )
    .limit(1);

  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const canViewAll = hasPermission(member.role, "viewAllPayslips");
  const isOwnSlip = employee?.id === row.employeeId;

  if (!canViewAll && !isOwnSlip) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const pdf = generatePayslipPdf({
    organizationName: row.organizationName,
    slipNumber: row.payslip.slipNumber,
    employeeName: row.userName,
    employeeCode: row.employeeCode,
    period: `${row.month}/${row.year}`,
    baseSalary: row.payslip.baseSalary,
    bonus: row.payslip.bonus,
    incentives: row.payslip.incentives,
    leaveDeduction: row.payslip.leaveDeduction,
    lateDeduction: row.payslip.lateDeduction,
    otherDeductions: row.payslip.otherDeductions,
    netSalary: row.payslip.netSalary,
    generatedAt: new Date(row.payslip.createdAt).toLocaleDateString("en-IN"),
  });

  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${row.payslip.slipNumber}.pdf"`,
    },
  });
}
