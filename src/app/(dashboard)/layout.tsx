import { getUnreadCount } from "@/actions/notifications";
import { DashboardHeader } from "@/components/dashboard-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireWorkspace } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ session, organization, member }, unreadNotificationCount] =
    await Promise.all([requireWorkspace(), getUnreadCount()]);

  return (
    <SidebarProvider>
      <AppSidebar
        organizationName={organization.name}
        role={member.role}
        unreadNotificationCount={unreadNotificationCount}
      />
      <SidebarInset className="bg-background">
        <DashboardHeader
          name={session.user.name}
          email={session.user.email}
          image={session.user.image}
          organizationName={organization.name}
          role={member.role}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
