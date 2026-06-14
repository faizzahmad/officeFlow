import { Clock, LogIn, LogOut } from "lucide-react";

import type { TodayAttendanceStatus } from "@/actions/attendance";
import { AttendanceActions } from "@/components/attendance-actions";
import { Card, CardContent } from "@/components/ui/card";
import { formatAttendanceTime, formatWorkHours } from "@/lib/attendance";
import { cn } from "@/lib/utils";

export function AttendanceTodayCard({
  status,
}: {
  status: TodayAttendanceStatus;
}) {
  const isActive = status.canCheckOut;
  const completedSessions =
    status.checkInCount - (isActive ? 1 : 0);

  return (
    <Card className="overflow-hidden border-border/80 shadow-sm">
      <div
        className={cn(
          "h-1",
          isActive ? "bg-emerald-500/70" : "bg-muted-foreground/20",
        )}
      />
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex size-2 rounded-full",
                isActive ? "bg-emerald-500" : "bg-muted-foreground/40",
              )}
            />
            <p className="text-sm font-medium">
              {isActive ? "Currently checked in" : "Not checked in"}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-start gap-2">
              <LogIn className="mt-0.5 size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Check-in time</p>
                <p className="text-sm font-medium">
                  {status.openCheckIn
                    ? formatAttendanceTime(status.openCheckIn)
                    : status.checkInCount > 0
                      ? "Session completed"
                      : "—"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Hours today</p>
                <p className="text-sm font-medium">
                  {formatWorkHours(status.todayTotalHours)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <LogOut className="mt-0.5 size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Sessions</p>
                <p className="text-sm font-medium">
                  {completedSessions} completed
                  {isActive ? " · 1 in progress" : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        <AttendanceActions status={status} />
      </CardContent>
    </Card>
  );
}
