export type MemberRole = "admin" | "hr" | "manager" | "employee";

export type Permission =
  | "manageEmployees"
  | "manageDepartments"
  | "generatePayroll"
  | "viewAllPayslips"
  | "approveLeave"
  | "createPerformanceReview"
  | "manageProjects"
  | "assignTasks"
  | "viewTeamAttendance"
  | "viewReports";

const permissionMap: Record<Permission, MemberRole[]> = {
  manageEmployees: ["admin", "hr"],
  manageDepartments: ["admin", "hr"],
  generatePayroll: ["admin", "hr"],
  viewAllPayslips: ["admin", "hr"],
  approveLeave: ["admin", "hr", "manager"],
  createPerformanceReview: ["admin", "hr", "manager"],
  manageProjects: ["admin", "hr", "manager"],
  assignTasks: ["admin", "hr", "manager"],
  viewTeamAttendance: ["admin", "hr", "manager"],
  viewReports: ["admin", "hr", "manager"],
};

const routeAccess: Record<string, MemberRole[]> = {
  "/dashboard": ["admin", "hr", "manager", "employee"],
  "/reports": ["admin", "hr", "manager"],
  "/notifications": ["admin", "hr", "manager", "employee"],
  "/employees": ["admin", "hr"],
  "/departments": ["admin", "hr"],
  "/attendance": ["admin", "hr", "manager", "employee"],
  "/leave": ["admin", "hr", "manager", "employee"],
  "/payroll": ["admin", "hr", "manager", "employee"],
  "/tasks": ["admin", "hr", "manager", "employee"],
  "/projects": ["admin", "hr", "manager"],
  "/performance": ["admin", "hr", "manager", "employee"],
};

export function hasPermission(role: MemberRole, permission: Permission): boolean {
  return permissionMap[permission].includes(role);
}

export function canAccessRoute(role: MemberRole, href: string): boolean {
  return routeAccess[href]?.includes(role) ?? false;
}
