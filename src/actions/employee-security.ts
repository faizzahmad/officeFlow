"use server";

import { hashPassword } from "better-auth/crypto";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { account, employees, organizationMembers } from "@/db/schema";
import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import { hasPermission } from "@/lib/permissions";
import { requireWorkspace } from "@/lib/session";

const MIN_PASSWORD_LENGTH = 8;

async function getTargetMember(userId: string, organizationId: string) {
  const [row] = await db
    .select({ role: organizationMembers.role })
    .from(organizationMembers)
    .where(
      and(
        eq(organizationMembers.userId, userId),
        eq(organizationMembers.organizationId, organizationId),
      ),
    )
    .limit(1);

  return row ?? null;
}

async function assertEmployeeInOrganization(
  userId: string,
  organizationId: string,
) {
  const [row] = await db
    .select({ id: employees.id })
    .from(employees)
    .where(
      and(
        eq(employees.userId, userId),
        eq(employees.organizationId, organizationId),
      ),
    )
    .limit(1);

  return row ?? null;
}

export async function setEmployeePasswordFormAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const { organization, member } = await requireWorkspace();
  if (!hasPermission(member.role, "manageEmployees")) {
    return actionError("You do not have permission to reset passwords");
  }

  const userId = String(formData.get("userId") ?? "").trim();
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!userId) return actionError("Employee not found");
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return actionError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }
  if (newPassword !== confirmPassword) {
    return actionError("Passwords do not match");
  }

  const employee = await assertEmployeeInOrganization(userId, organization.id);
  if (!employee) {
    return actionError("Employee not found in your organization");
  }

  const targetMember = await getTargetMember(userId, organization.id);
  if (targetMember?.role === "admin" && member.role !== "admin") {
    return actionError("Only admins can reset another admin's password");
  }

  const hashedPassword = await hashPassword(newPassword);

  const [credentialAccount] = await db
    .select()
    .from(account)
    .where(
      and(eq(account.userId, userId), eq(account.providerId, "credential")),
    )
    .limit(1);

  if (credentialAccount) {
    await db
      .update(account)
      .set({ password: hashedPassword })
      .where(eq(account.id, credentialAccount.id));
  } else {
    await db.insert(account).values({
      id: crypto.randomUUID(),
      accountId: userId,
      providerId: "credential",
      userId,
      password: hashedPassword,
    });
  }

  revalidatePath("/employees");
  revalidatePath("/employee-records");
  revalidatePath(`/employee-records/${employee.id}`);
  return actionSuccess("Password updated successfully");
}
