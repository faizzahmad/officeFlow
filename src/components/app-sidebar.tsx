"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  sidebarMenuButtonVariants,
} from "@/components/ui/sidebar";
import { navGroups } from "@/lib/navigation";
import { canAccessRoute, type MemberRole } from "@/lib/permissions";
import { cn } from "@/lib/utils";

export function AppSidebar({
  organizationName,
  role,
  unreadNotificationCount = 0,
}: {
  organizationName: string;
  role: MemberRole;
  unreadNotificationCount?: number;
}) {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-sidebar-border/80">
      <SidebarHeader className="border-b border-sidebar-border/80 p-4">
        <Logo href="/dashboard" />
        <p className="mt-3 truncate rounded-lg bg-sidebar-accent px-3 py-2 text-xs font-medium text-sidebar-accent-foreground">
          {organizationName}
        </p>
      </SidebarHeader>
      <SidebarContent className="gap-0 py-2">
        {navGroups.map((group) => {
          const items = group.items.filter((item) =>
            canAccessRoute(role, item.href),
          );
          if (items.length === 0) return null;

          return (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="px-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          sidebarMenuButtonVariants({ size: "default" }),
                          "mx-2 rounded-lg transition-colors",
                          isActive &&
                            "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                        <span className="flex flex-1 items-center justify-between gap-2">
                          <span>{item.title}</span>
                          {item.href === "/notifications" &&
                          unreadNotificationCount > 0 ? (
                            <span
                              className={cn(
                                "flex size-5 min-w-5 items-center justify-center rounded-full text-[10px] font-semibold tabular-nums",
                                isActive
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-destructive text-white",
                              )}
                              aria-label={`${unreadNotificationCount} unread notifications`}
                            >
                              {unreadNotificationCount > 99
                                ? "99+"
                                : unreadNotificationCount}
                            </span>
                          ) : null}
                        </span>
                      </Link>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/80 p-4">
        <div className="rounded-xl border border-primary/10 bg-sidebar-accent p-3">
          <p className="text-xs font-semibold text-foreground">Pro tip</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Use Reports to track team performance weekly.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
