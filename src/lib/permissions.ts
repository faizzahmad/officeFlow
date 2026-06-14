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
  | "viewReports"
  | "viewEmployeeRecords"
  | "manageOrganization";

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
  viewEmployeeRecords: ["admin", "hr"],
  manageOrganization: ["admin"],
};

const routeAccess: Record<string, MemberRole[]> = {
  "/dashboard": ["admin", "hr", "manager", "employee"],
  "/reports": ["admin", "hr", "manager"],
  "/notifications": ["admin", "hr", "manager", "employee"],
  "/employees": ["admin", "hr"],
  "/employee-records": ["admin", "hr"],
  "/departments": ["admin", "hr"],
  "/attendance": ["admin", "hr", "manager", "employee"],
  "/leave": ["admin", "hr", "manager", "employee"],
  "/payroll": ["admin", "hr", "manager", "employee"],
  "/tasks": ["admin", "hr", "manager", "employee"],
  "/projects": ["admin", "hr", "manager"],
  "/performance": ["admin", "hr", "manager", "employee"],
  "/profile": ["admin", "hr", "manager", "employee"],
  "/settings": ["admin"],
};

export function hasPermission(role: MemberRole, permission: Permission): boolean {
  return permissionMap[permission].includes(role);
}

export function canAccessRoute(role: MemberRole, href: string): boolean {
  if (routeAccess[href]?.includes(role)) return true;

  if (href.startsWith("/employee-records/")) {
    return routeAccess["/employee-records"]?.includes(role) ?? false;
  }

  if (href.startsWith("/payroll/payslips/")) {
    return routeAccess["/payroll"]?.includes(role) ?? false;
  }

  return false;
}
