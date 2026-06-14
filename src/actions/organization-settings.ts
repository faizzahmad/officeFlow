"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { organizations, workSettings } from "@/db/schema";
import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import { hasPermission } from "@/lib/permissions";
import { requireWorkspace } from "@/lib/session";

function optionalField(formData: FormData, key: string): string | null {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

export async function getOrganizationSettings() {
  const { organization, member } = await requireWorkspace();
  if (!hasPermission(member.role, "manageOrganization")) {
    return null;
  }

  const [settings] = await db
    .select()
    .from(workSettings)
    .where(eq(workSettings.organizationId, organization.id))
    .limit(1);

  return {
    organization,
    workSettings: settings ?? null,
  };
}

export async function updateOrganizationSettingsFormAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const { organization, member } = await requireWorkspace();
  if (!hasPermission(member.role, "manageOrganization")) {
    return actionError("You do not have permission to update organization settings");
  }

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return actionError("Organization name is required");

  await db
    .update(organizations)
    .set({
      name,
      contactEmail: optionalField(formData, "contactEmail"),
      contactPhone: optionalField(formData, "contactPhone"),
      website: optionalField(formData, "website"),
      address: optionalField(formData, "address"),
    })
    .where(eq(organizations.id, organization.id));

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return actionSuccess("Organization settings saved");
}

export async function updateWorkSettingsFormAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const { organization, member } = await requireWorkspace();
  if (!hasPermission(member.role, "manageOrganization")) {
    return actionError("You do not have permission to update work policies");
  }

  const workStartHour = Number(formData.get("workStartHour"));
  const workStartMinute = Number(formData.get("workStartMinute"));
  const workEndHour = Number(formData.get("workEndHour"));
  const workEndMinute = Number(formData.get("workEndMinute"));
  const lateGraceMinutes = Number(formData.get("lateGraceMinutes"));
  const halfDayHours = String(formData.get("halfDayHours") ?? "").trim();

  if (
    Number.isNaN(workStartHour) ||
    Number.isNaN(workEndHour) ||
    Number.isNaN(lateGraceMinutes) ||
    !halfDayHours
  ) {
    return actionError("Enter valid work policy values");
  }

  const [existing] = await db
    .select()
    .from(workSettings)
    .where(eq(workSettings.organizationId, organization.id))
    .limit(1);

  const values = {
    workStartHour,
    workStartMinute: Number.isNaN(workStartMinute) ? 0 : workStartMinute,
    workEndHour,
    workEndMinute: Number.isNaN(workEndMinute) ? 0 : workEndMinute,
    lateGraceMinutes,
    halfDayHours,
  };

  if (existing) {
    await db
      .update(workSettings)
      .set(values)
      .where(eq(workSettings.id, existing.id));
  } else {
    await db.insert(workSettings).values({
      organizationId: organization.id,
      ...values,
    });
  }

  revalidatePath("/settings");
  revalidatePath("/attendance");
  return actionSuccess("Work policies saved");
}
