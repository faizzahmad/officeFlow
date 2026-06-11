import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ActivityProps = {
  recentTasks: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: Date;
  }>;
  recentLeaves: Array<{
    id: string;
    status: string;
    days: number;
    userName: string;
    createdAt: Date;
  }>;
  recentNotifications: Array<{
    id: string;
    title: string;
    message: string;
    type: string;
    createdAt: Date;
    isRead: boolean;
  }>;
};

function timeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function RecentActivity({
  recentTasks,
  recentLeaves,
  recentNotifications,
}: ActivityProps) {
  const items = [
    ...recentNotifications.map((n) => ({
      id: `n-${n.id}`,
      title: n.title,
      subtitle: n.message,
      badge: n.type.replace("_", " "),
      time: n.createdAt,
      unread: !n.isRead,
    })),
    ...recentTasks.map((t) => ({
      id: `t-${t.id}`,
      title: t.title,
      subtitle: "New task",
      badge: t.status.replace("_", " "),
      time: t.createdAt,
      unread: false,
    })),
    ...recentLeaves.map((l) => ({
      id: `l-${l.id}`,
      title: `${l.userName} — ${l.days} day leave`,
      subtitle: "Leave request",
      badge: l.status,
      time: l.createdAt,
      unread: false,
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 8);

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle className="font-heading text-base">Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity yet.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 p-3"
            >
              <div className="min-w-0 space-y-1">
                <p className="truncate text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                <Badge variant="outline" className="capitalize text-[10px]">
                  {item.badge}
                </Badge>
              </div>
              <div className="shrink-0 text-right">
                {item.unread ? (
                  <span className="mb-1 inline-block size-2 rounded-full bg-primary" />
                ) : null}
                <p className="text-[10px] text-muted-foreground">
                  {timeAgo(item.time)}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
