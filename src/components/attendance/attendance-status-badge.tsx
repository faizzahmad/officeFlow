import { Badge } from "@/components/ui/badge";
import {
  attendanceStatusLabel,
  attendanceStatusStyles,
} from "@/lib/attendance";
import type { attendanceRecords } from "@/db/schema";
import { cn } from "@/lib/utils";

type AttendanceStatus = typeof attendanceRecords.$inferSelect["status"];

export function AttendanceStatusBadge({
  status,
  className,
}: {
  status: AttendanceStatus;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium capitalize",
        attendanceStatusStyles[status],
        className,
      )}
    >
      {attendanceStatusLabel[status]}
    </Badge>
  );
}
