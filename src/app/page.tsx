import { redirect } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  ClipboardList,
  Clock,
  DollarSign,
  Users,
} from "lucide-react";

import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSession, getWorkspace } from "@/lib/session";

const features = [
  {
    title: "Employee management",
    description: "Roles, departments, and org structure in one place.",
    icon: Users,
  },
  {
    title: "Attendance & leave",
    description: "Check-in/out, work hours, leave approvals, and balances.",
    icon: Clock,
  },
  {
    title: "Payroll & slips",
    description: "Monthly salary runs, deductions, and payslip generation.",
    icon: DollarSign,
  },
  {
    title: "Task management",
    description: "Assign work, track deadlines, and use a Kanban board.",
    icon: ClipboardList,
  },
  {
    title: "Performance",
    description: "Daily reports, manager feedback, and scoring.",
    icon: BarChart3,
  },
  {
    title: "Leave calendar",
    description: "Apply, approve, and monitor team availability.",
    icon: CalendarDays,
  },
];

export default async function HomePage() {
  const session = await getSession();
  if (session?.user) {
    const workspace = await getWorkspace(session.user.id);
    redirect(workspace ? "/dashboard" : "/pending");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-secondary" />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Logo href="/" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ButtonLink variant="outline" href="/login">
            Sign in
          </ButtonLink>
          <ButtonLink href="/register">Start free</ButtonLink>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-10">
        <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              All-in-One Office CRM
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Run HR, payroll, and tasks like a{" "}
              <span className="text-primary">
                modern SaaS
              </span>
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Replace messy Excel sheets with Office Flow — a mini Zoho People +
              Jira for startups, agencies, and small companies.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink size="lg" href="/register" className="gap-2">
                Create workspace
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink size="lg" variant="outline" href="/login">
                Sign in
              </ButtonLink>
              <ButtonLink size="lg" variant="ghost" href="/signup">
                Employee signup
              </ButtonLink>
            </div>
            <div className="flex flex-wrap gap-6 pt-2 text-sm text-muted-foreground">
              <span>₹999–₹4999/month ready</span>
              <span>Multi-module CRM</span>
              <span>Dark & light mode</span>
            </div>
          </div>

          <Card className="overflow-hidden border-primary/10 shadow-xl shadow-primary/10">
            <CardContent className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Employees", value: "48" },
                  { label: "Present today", value: "41" },
                  { label: "Tasks done", value: "86%" },
                  { label: "Payroll", value: "Ready" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border bg-card/80 p-4 backdrop-blur-sm"
                  >
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="mt-1 font-heading text-2xl font-bold text-primary">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-secondary p-4">
                <p className="text-sm font-medium">Built for Indian SMBs</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Startups, agencies, coaching centers, and IT teams.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-border/80 transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
            >
              <CardContent className="space-y-3 p-5">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="font-heading font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
