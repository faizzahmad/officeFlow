"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { clients, employees, projects, timeEntries, user } from "@/db/schema";
import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import { requireWorkspace } from "@/lib/session";

export async function getProjects() {
  const { organization } = await requireWorkspace();

  return db
    .select({
      project: projects,
      clientName: clients.name,
      managerName: user.name,
    })
    .from(projects)
    .leftJoin(clients, eq(projects.clientId, clients.id))
    .leftJoin(employees, eq(projects.managerId, employees.id))
    .leftJoin(user, eq(employees.userId, user.id))
    .where(eq(projects.organizationId, organization.id))
    .orderBy(desc(projects.createdAt));
}

export async function getClients() {
  const { organization } = await requireWorkspace();
  return db
    .select()
    .from(clients)
    .where(eq(clients.organizationId, organization.id));
}

export async function createProject(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const { organization } = await requireWorkspace();

  const name = String(formData.get("name") ?? "").trim();
  const clientId = String(formData.get("clientId") ?? "").trim() || null;
  const budget = String(formData.get("budget") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim();

  if (!name) return actionError("Project name is required");

  await db.insert(projects).values({
    organizationId: organization.id,
    name,
    clientId,
    budget,
    description: description || null,
    status: "active",
  });

  revalidatePath("/projects");
  return actionSuccess("Project created");
}

export async function createClient(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const { organization } = await requireWorkspace();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();

  if (!name) return actionError("Client name is required");

  await db.insert(clients).values({
    organizationId: organization.id,
    name,
    email: email || null,
    company: company || null,
  });

  revalidatePath("/projects");
  return actionSuccess("Client saved");
}

export async function logTimeEntry(formData: FormData) {
  const { organization, employee } = await requireWorkspace();
  if (!employee) return { error: "Employee profile not found" };

  const projectId = String(formData.get("projectId") ?? "");
  const hours = String(formData.get("hours") ?? "");
  const date = String(formData.get("date") ?? "");
  const description = String(formData.get("description") ?? "").trim();

  if (!projectId || !hours || !date) {
    return { error: "Project, hours, and date are required" };
  }

  await db.insert(timeEntries).values({
    organizationId: organization.id,
    projectId,
    employeeId: employee.id,
    hours,
    date,
    description: description || null,
  });

  revalidatePath("/projects");
  return { success: true };
}
