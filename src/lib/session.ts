import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { db } from "@/db";
import {
  employees,
  organizationMembers,
  organizations,
} from "@/db/schema";

import {
  canAccessRoute,
  hasPermission,
  type MemberRole,
  type Permission,
} from "./permissions";

import { auth } from "./auth";

export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

export async function requireSession() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

export const getWorkspace = cache(async (userId: string) => {
  const [row] = await db
    .select({
      member: organizationMembers,
      organization: organizations,
      employee: employees,
    })
    .from(organizationMembers)
    .innerJoin(
      organizations,
      eq(organizationMembers.organizationId, organizations.id),
    )
    .leftJoin(
      employees,
      and(
        eq(employees.userId, organizationMembers.userId),
        eq(employees.organizationId, organizations.id),
      ),
    )
    .where(eq(organizationMembers.userId, userId))
    .limit(1);

  return row ?? null;
});

export async function requireWorkspace() {
  const session = await requireSession();
  const workspace = await getWorkspace(session.user.id);

  if (!workspace) {
    redirect("/pending");
  }

  return { session, ...workspace };
}

export function getRolePermissions(role: MemberRole) {
  return {
    role,
    canManageEmployees: hasPermission(role, "manageEmployees"),
    canManageDepartments: hasPermission(role, "manageDepartments"),
    canGeneratePayroll: hasPermission(role, "generatePayroll"),
    canViewAllPayslips: hasPermission(role, "viewAllPayslips"),
    canApproveLeave: hasPermission(role, "approveLeave"),
    canCreatePerformanceReview: hasPermission(role, "createPerformanceReview"),
    canManageProjects: hasPermission(role, "manageProjects"),
    canAssignTasks: hasPermission(role, "assignTasks"),
    canViewTeamAttendance: hasPermission(role, "viewTeamAttendance"),
    canViewReports: hasPermission(role, "viewReports"),
    canViewEmployeeRecords: hasPermission(role, "viewEmployeeRecords"),
    canManageOrganization: hasPermission(role, "manageOrganization"),
  };
}

export async function requirePermission(permission: Permission) {
  const workspace = await requireWorkspace();
  if (!hasPermission(workspace.member.role, permission)) {
    redirect("/dashboard");
  }
  return workspace;
}

export async function requireRouteAccess(pathname: string) {
  const workspace = await requireWorkspace();
  if (!canAccessRoute(workspace.member.role, pathname)) {
    redirect("/dashboard");
  }
  return workspace;
}
