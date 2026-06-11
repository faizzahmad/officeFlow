import { CalendarDays, CheckCircle2, Clock, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const iconMap = {
  users: Users,
  clock: Clock,
  check: CheckCircle2,
  calendar: CalendarDays,
} as const;

export function StatCardIcon({
  title,
  value,
  hint,
  icon,
  trend,
  accent = "primary",
}: {
  title: string;
  value: string | number;
  hint?: string;
  icon: keyof typeof iconMap;
  trend?: string;
  accent?: "primary" | "brand" | "secondary";
}) {
  const Icon = iconMap[icon];
  const styles: Record<
    typeof accent,
    { bar: string; icon: string; glow: string }
  > = {
    primary: {
      bar: "bg-primary/25",
      icon: "bg-primary/10 text-primary",
      glow: "shadow-primary/10",
    },
    brand: {
      bar: "bg-brand/25",
      icon: "bg-brand/10 text-brand",
      glow: "shadow-brand/10",
    },
    secondary: {
      bar: "bg-secondary",
      icon: "bg-secondary text-secondary-foreground",
      glow: "shadow-secondary/10",
    },
  };

  const style = styles[accent];

  return (
    <Card
      className={cn(
        "overflow-hidden border-border/80 shadow-sm transition-shadow hover:shadow-md",
        style.glow,
      )}
    >
      <div className={cn("h-1", style.bar)} />
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-lg",
            style.icon,
          )}
        >
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="font-heading text-3xl font-bold tracking-tight">
          {value}
        </div>
        {hint ? (
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        ) : null}
        {trend ? (
          <p className="mt-2 text-xs font-medium text-primary">{trend}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
