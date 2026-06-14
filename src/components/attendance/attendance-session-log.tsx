import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AttendanceSessionTable,
  type AttendanceSessionRow,
} from "@/components/attendance/attendance-session-table";

export function AttendanceSessionLog({
  records,
  showEmployee,
  periodLabel,
}: {
  records: AttendanceSessionRow[];
  showEmployee: boolean;
  periodLabel: string;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Time entries</CardTitle>
        <p className="text-sm text-muted-foreground">
          {periodLabel} · {records.length}{" "}
          {records.length === 1 ? "session" : "sessions"}
        </p>
      </CardHeader>
      <CardContent>
        <AttendanceSessionTable data={records} showEmployee={showEmployee} />
      </CardContent>
    </Card>
  );
}
