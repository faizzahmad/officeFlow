import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  hint,
  accent = "primary",
}: {
  title: string;
  value: string | number;
  hint?: string;
  accent?: "primary" | "brand" | "secondary";
}) {
  const accentClasses = {
    primary: "bg-primary/25",
    brand: "bg-brand/25",
    secondary: "bg-secondary",
  };

  return (
    <Card className="overflow-hidden border-border/80 shadow-sm">
      <div className={cn("h-1", accentClasses[accent])} />
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="font-heading text-3xl font-bold tracking-tight">
          {value}
        </div>
        {hint ? (
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
