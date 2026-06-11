import {
  CalendarDays,
  ClipboardList,
  Clock,
  DollarSign,
  Users,
} from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const actions = [
  {
    href: "/attendance",
    label: "Check in",
    icon: Clock,
    description: "Mark attendance",
  },
  {
    href: "/leave",
    label: "Apply leave",
    icon: CalendarDays,
    description: "Request time off",
  },
  {
    href: "/tasks",
    label: "View tasks",
    icon: ClipboardList,
    description: "Track your work",
  },
  {
    href: "/payroll",
    label: "Payroll",
    icon: DollarSign,
    description: "Salary slips",
  },
  {
    href: "/employees",
    label: "Employees",
    icon: Users,
    description: "Manage team",
    roles: ["admin", "hr"] as const,
  },
];

export function QuickActions({ role }: { role: string }) {
  const visible = actions.filter(
    (action) =>
      !action.roles ||
      action.roles.includes(role as (typeof action.roles)[number]),
  );

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle className="font-heading text-base">Quick actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {visible.map((action) => (
          <ButtonLink
            key={action.href}
            href={action.href}
            variant="outline"
            className="h-auto justify-start gap-3 px-3 py-3"
          >
            <action.icon className="size-4 shrink-0 text-primary" />
            <span className="text-left">
              <span className="block text-sm font-medium">{action.label}</span>
              <span className="block text-xs font-normal text-muted-foreground">
                {action.description}
              </span>
            </span>
          </ButtonLink>
        ))}
      </CardContent>
    </Card>
  );
}
