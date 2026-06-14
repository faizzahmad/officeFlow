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
import type { EmployeeProfileRow } from "@/lib/employee-profile";
import { hasPermission } from "@/lib/permissions";
import { requireWorkspace } from "@/lib/session";

function employeeProfileSelect() {
  return {
    employee: employees,
    userName: user.name,
    userEmail: user.email,
    userImage: user.image,
    departmentName: departments.name,
    memberRole: organizationMembers.role,
  };
}

export async function getMyEmployeeProfile(): Promise<EmployeeProfileRow | null> {
  const { organization, employee } = await requireWorkspace();
  if (!employee) return null;

  const [row] = await db
    .select(employeeProfileSelect())
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
    .where(
      and(
        eq(employees.organizationId, organization.id),
        eq(employees.id, employee.id),
      ),
    );

  return row ?? null;
}

export async function getEmployeeProfiles(): Promise<EmployeeProfileRow[]> {
  const { organization, member } = await requireWorkspace();
  if (!hasPermission(member.role, "viewEmployeeRecords")) {
    return [];
  }

  return db
    .select(employeeProfileSelect())
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

export async function getEmployeeProfileById(
  employeeId: string,
): Promise<EmployeeProfileRow | null> {
  const { organization, member } = await requireWorkspace();
  if (!hasPermission(member.role, "viewEmployeeRecords")) {
    return null;
  }

  const [row] = await db
    .select(employeeProfileSelect())
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
    .where(
      and(
        eq(employees.organizationId, organization.id),
        eq(employees.id, employeeId),
      ),
    );

  return row ?? null;
}

function optionalField(formData: FormData, key: string): string | null {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

export async function updatePersonalDetailsFormAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const { organization, employee } = await requireWorkspace();
  if (!employee) {
    return actionError("Employee profile not found");
  }

  const phone = optionalField(formData, "phone");
  const address = optionalField(formData, "address");
  const city = optionalField(formData, "city");
  const state = optionalField(formData, "state");
  const postalCode = optionalField(formData, "postalCode");
  const dateOfBirth = optionalField(formData, "dateOfBirth");
  const emergencyContactName = optionalField(formData, "emergencyContactName");
  const emergencyContactPhone = optionalField(formData, "emergencyContactPhone");
  const emergencyContactRelation = optionalField(
    formData,
    "emergencyContactRelation",
  );

  await db
    .update(employees)
    .set({
      phone,
      address,
      city,
      state,
      postalCode,
      dateOfBirth,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
    })
    .where(
      and(
        eq(employees.id, employee.id),
        eq(employees.organizationId, organization.id),
      ),
    );

  revalidatePath("/profile");
  revalidatePath("/employee-records");
  revalidatePath(`/employee-records/${employee.id}`);
  return actionSuccess("Personal details saved");
}

export async function updateBankDetailsFormAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const { organization, employee } = await requireWorkspace();
  if (!employee) {
    return actionError("Employee profile not found");
  }

  const bankName = optionalField(formData, "bankName");
  const bankAccountHolderName = optionalField(formData, "bankAccountHolderName");
  const bankAccountNumber = optionalField(formData, "bankAccountNumber");
  const bankIfsc = optionalField(formData, "bankIfsc")?.toUpperCase() ?? null;

  const bankFields = [
    bankName,
    bankAccountHolderName,
    bankAccountNumber,
    bankIfsc,
  ];
  const anyBankField = bankFields.some(Boolean);
  const allBankFields = bankFields.every(Boolean);

  if (anyBankField && !allBankFields) {
    return actionError("Fill in all bank details or leave them all empty");
  }

  if (bankIfsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankIfsc)) {
    return actionError("Enter a valid IFSC code");
  }

  await db
    .update(employees)
    .set({
      bankName,
      bankAccountHolderName,
      bankAccountNumber,
      bankIfsc,
    })
    .where(
      and(
        eq(employees.id, employee.id),
        eq(employees.organizationId, organization.id),
      ),
    );

  revalidatePath("/profile");
  revalidatePath("/employee-records");
  revalidatePath(`/employee-records/${employee.id}`);
  return actionSuccess("Bank details saved");
}
