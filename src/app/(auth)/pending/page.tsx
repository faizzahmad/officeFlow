import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth-shell";
import { SignOutButton } from "@/components/sign-out-button";
import { ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSession, getWorkspace } from "@/lib/session";

export default async function PendingPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const workspace = await getWorkspace(session.user.id);
  if (workspace) {
    redirect("/dashboard");
  }

  return (
    <AuthShell
      title="Waiting for workspace access"
      subtitle="Your account is ready. Your company admin needs to add you before you can use the dashboard."
    >
      <Card className="border-border/80 shadow-lg shadow-primary/5">
        <CardHeader className="space-y-1">
          <CardTitle className="font-heading text-2xl">Almost there</CardTitle>
          <CardDescription>
            Signed in as {session.user.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">What to do next</p>
            <ol className="mt-2 list-decimal space-y-1 pl-4">
              <li>Share your email with your HR or admin team.</li>
              <li>They add you under Employees in Office Flow.</li>
              <li>Refresh this page or sign in again to access attendance, leave, and payslips.</li>
            </ol>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/pending">Refresh status</ButtonLink>
            <SignOutButton />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Are you setting up a new company?{" "}
            <Link
              href="/register?setup=required"
              className="font-medium text-primary hover:underline"
            >
              Create workspace
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
