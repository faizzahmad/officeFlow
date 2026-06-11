import { UserProfileMenu } from "@/components/user-profile-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader({
  name,
  email,
  image,
  organizationName,
  role,
}: {
  name: string;
  email: string;
  image?: string | null;
  organizationName: string;
  role: string;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div className="hidden h-6 w-px bg-border sm:block" />
        <p className="hidden text-sm text-muted-foreground sm:block">
          {organizationName}
        </p>
      </div>
      <UserProfileMenu
        name={name}
        email={email}
        image={image}
        organizationName={organizationName}
        role={role}
      />
    </header>
  );
}
