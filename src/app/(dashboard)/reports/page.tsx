import { getAttendanceSummary } from "@/actions/attendance";
import { parseAttendanceFilters } from "@/lib/attendance";
import { getDashboardStats } from "@/actions/dashboard";
import { getTaskStats } from "@/actions/tasks";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePermission } from "@/lib/session";

export default async function ReportsPage() {
  await requirePermission("viewReports");
  const now = new Date();
  const attendanceFilters = parseAttendanceFilters({}, {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    employeeId: "all",
  });

  const [dashboard, taskStats, attendance] = await Promise.all([
    getDashboardStats(),
    getTaskStats(),
    getAttendanceSummary(attendanceFilters),
  ]);

  const attendanceMap = Object.fromEntries(
    attendance.map((row) => [row.status, row.count]),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Weekly performance, attendance, and task completion analytics."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Employees" value={dashboard.employees} />
        <StatCard title="Task completion" value={`${taskStats.completionRate}%`} />
        <StatCard title="Present (month)" value={attendanceMap.present ?? 0} />
        <StatCard title="Late (month)" value={attendanceMap.late ?? 0} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Task breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Pending: {taskStats.pending}</p>
            <p>In progress: {taskStats.in_progress}</p>
            <p>Completed: {taskStats.completed}</p>
            <p>Cancelled: {taskStats.cancelled}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Attendance breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Present: {attendanceMap.present ?? 0}</p>
            <p>Late: {attendanceMap.late ?? 0}</p>
            <p>Half day: {attendanceMap.half_day ?? 0}</p>
            <p>Absent: {attendanceMap.absent ?? 0}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
