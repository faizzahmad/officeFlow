"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import {
  departments,
  employees,
  organizationMembers,
  user,
} from "@/db/schema";
import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import { seedLeaveBalancesForEmployee } from "@/lib/employee-onboard";
import { hasPermission, type MemberRole } from "@/lib/permissions";
import { requireWorkspace } from "@/lib/session";

const assignableRoles: MemberRole[] = ["employee", "manager", "hr"];

export async function getEmployees() {
  const { organization } = await requireWorkspace();

  return db
    .select({
      employee: employees,
      departmentName: departments.name,
      userName: user.name,
      userEmail: user.email,
      memberRole: organizationMembers.role,
    })
    .from(employees)
    .innerJoin(user, eq(employees.userId, user.id))
    .innerJoin(
      organizationMembers,
      and(
        eq(organizationMembers.userId, employees.userId),
        eq(organizationMembers.organizationId, employees.organizationId),
      ),
    )
    .leftJoin(departments, eq(employees.departmentId, departments.id))
    .where(eq(employees.organizationId, organization.id));
}

export async function createEmployee(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const { organization, member } = await requireWorkspace();
  if (!hasPermission(member.role, "manageEmployees")) {
    return actionError("You do not have permission to add employees");
  }

  const email = String(formData.get("email") ?? "").trim();
  const employeeCode = String(formData.get("employeeCode") ?? "").trim();
  const designation = String(formData.get("designation") ?? "").trim();
  const departmentId = String(formData.get("departmentId") ?? "").trim() || null;
  const baseSalary = String(formData.get("baseSalary") ?? "0").trim();
  const role = String(formData.get("role") ?? "employee") as MemberRole;

  if (!email || !employeeCode) {
    return actionError("Email and employee code are required");
  }

  if (!assignableRoles.includes(role)) {
    return actionError("Invalid role selected");
  }

  if (role === "hr" && member.role !== "admin") {
    return actionError("Only admins can assign the HR role");
  }

  const [existingUser] = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (!existingUser) {
    return actionError(
      "No account found for this email. Ask them to sign up at /signup first.",
    );
  }

  const [existingMember] = await db
    .select()
    .from(organizationMembers)
    .where(
      and(
        eq(organizationMembers.organizationId, organization.id),
        eq(organizationMembers.userId, existingUser.id),
      ),
    )
    .limit(1);

  if (existingMember) {
    return actionError("This user is already a member of your organization");
  }

  const [existingEmployee] = await db
    .select()
    .from(employees)
    .where(
      and(
        eq(employees.organizationId, organization.id),
        eq(employees.userId, existingUser.id),
      ),
    )
    .limit(1);

  if (existingEmployee) {
    return actionError("This user already has an employee profile");
  }

  await db.insert(organizationMembers).values({
    organizationId: organization.id,
    userId: existingUser.id,
    role,
  });

  const [newEmployee] = await db
    .insert(employees)
    .values({
      organizationId: organization.id,
      userId: existingUser.id,
      departmentId,
      employeeCode,
      designation: designation || null,
      baseSalary,
    })
    .returning();

  await seedLeaveBalancesForEmployee(organization.id, newEmployee.id);

  revalidatePath("/employees");
  return actionSuccess(`${existingUser.name} added to your team`);
}

export async function getDepartments() {
  const { organization } = await requireWorkspace();

  return db
    .select()
    .from(departments)
    .where(eq(departments.organizationId, organization.id));
}

export async function createDepartment(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const { organization, member } = await requireWorkspace();
  if (!hasPermission(member.role, "manageDepartments")) {
    return actionError("You do not have permission to manage departments");
  }

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name) return actionError("Department name is required");

  await db.insert(departments).values({
    organizationId: organization.id,
    name,
    description: description || null,
  });

  revalidatePath("/departments");
  revalidatePath("/employees");
  return actionSuccess("Department created");
}

export async function updateDepartment(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const { organization, member } = await requireWorkspace();
  if (!hasPermission(member.role, "manageDepartments")) {
    return actionError("You do not have permission to manage departments");
  }

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!id || !name) return actionError("Department name is required");

  const [existing] = await db
    .select()
    .from(departments)
    .where(
      and(
        eq(departments.id, id),
        eq(departments.organizationId, organization.id),
      ),
    )
    .limit(1);

  if (!existing) return actionError("Department not found");

  await db
    .update(departments)
    .set({
      name,
      description: description || null,
    })
    .where(eq(departments.id, id));

  revalidatePath("/departments");
  revalidatePath("/employees");
  return actionSuccess("Department updated");
}

export async function deleteDepartment(id: string): Promise<ActionResult> {
  const { organization, member } = await requireWorkspace();
  if (!hasPermission(member.role, "manageDepartments")) {
    return actionError("You do not have permission to manage departments");
  }

  const [existing] = await db
    .select()
    .from(departments)
    .where(
      and(
        eq(departments.id, id),
        eq(departments.organizationId, organization.id),
      ),
    )
    .limit(1);

  if (!existing) return actionError("Department not found");

  await db.delete(departments).where(eq(departments.id, id));

  revalidatePath("/departments");
  revalidatePath("/employees");
  return actionSuccess("Department deleted");
}
