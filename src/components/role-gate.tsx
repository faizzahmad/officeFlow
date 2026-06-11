import type { Permission } from "@/lib/permissions";
import { hasPermission, type MemberRole } from "@/lib/permissions";

export function RoleGate({
  role,
  permission,
  children,
  fallback = null,
}: {
  role: MemberRole;
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  if (!hasPermission(role, permission)) {
    return fallback;
  }

  return children;
}
