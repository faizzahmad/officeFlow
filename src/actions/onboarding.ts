"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import {
  departments,
  employees,
  leaveTypes,
  organizationMembers,
  organizations,
  workSettings,
} from "@/db/schema";
import { seedLeaveBalancesForEmployee } from "@/lib/employee-onboard";
import { requireSession } from "@/lib/session";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function setupWorkspace(formData: FormData) {
  const session = await requireSession();
  const companyName = String(formData.get("companyName") ?? "").trim();

  if (!companyName) {
    return { error: "Company name is required" };
  }

  const existing = await db
    .select()
    .from(organizationMembers)
    .where(eq(organizationMembers.userId, session.user.id))
    .limit(1);

  if (existing.length > 0) {
    return { error: "Workspace already exists" };
  }

  const slug = `${slugify(companyName)}-${Date.now().toString(36)}`;

  const [organization] = await db
    .insert(organizations)
    .values({ name: companyName, slug })
    .returning();

  await db.insert(organizationMembers).values({
    organizationId: organization.id,
    userId: session.user.id,
    role: "admin",
  });

  const [generalDept] = await db
    .insert(departments)
    .values({
      organizationId: organization.id,
      name: "General",
      description: "Default department",
    })
    .returning();

  const [adminEmployee] = await db
    .insert(employees)
    .values({
      organizationId: organization.id,
      userId: session.user.id,
      departmentId: generalDept.id,
      employeeCode: "EMP001",
      designation: "Admin",
      baseSalary: "0",
    })
    .returning();

  await db.insert(workSettings).values({
    organizationId: organization.id,
  });

  const defaultLeaveTypes = [
    { name: "Casual Leave", defaultDays: 12, isPaid: 1 },
    { name: "Sick Leave", defaultDays: 10, isPaid: 1 },
    { name: "Earned Leave", defaultDays: 15, isPaid: 1 },
  ];

  await db.insert(leaveTypes).values(
    defaultLeaveTypes.map((type) => ({
      organizationId: organization.id,
      ...type,
    })),
  );

  await seedLeaveBalancesForEmployee(organization.id, adminEmployee.id);

  revalidatePath("/dashboard");
  return { success: true };
}
