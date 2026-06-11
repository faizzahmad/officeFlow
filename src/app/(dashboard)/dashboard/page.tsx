import {
  getDashboardCharts,
  getDashboardStats,
  getRecentActivity,
} from "@/actions/dashboard";
import {
  AttendanceStatusChart,
  AttendanceTrendChart,
  LeaveStatusChart,
  TaskBreakdownChart,
} from "@/components/dashboard/dashboard-charts";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatCardIcon } from "@/components/dashboard/stat-card-icon";
import { TeamPulse } from "@/components/dashboard/team-pulse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireWorkspace } from "@/lib/session";

export default async function DashboardPage() {
  const { session, organization, member } = await requireWorkspace();

  const [stats, charts, activity] = await Promise.all([
    getDashboardStats(),
    getDashboardCharts(),
    getRecentActivity(),
  ]);

  const openTasks = stats.totalTasks - stats.completedTasks;
  const greeting = getGreeting();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary/10 bg-secondary p-6 shadow-sm">
        <div className="space-y-1">
          <p className="text-sm font-medium text-primary">{greeting}</p>
          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            {session.user.name}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            {organization.name} workspace —{" "}
            {stats.viewMode === "team"
              ? "here's what's happening across HR, attendance, tasks, and payroll."
              : "your personal attendance, leave, tasks, and payslips."}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.viewMode === "team" ? (
          <StatCardIcon
            title="Active employees"
            value={stats.employees}
            hint="Total active team members"
            icon="users"
            accent="primary"
          />
        ) : (
          <StatCardIcon
            title="My active tasks"
            value={stats.inProgressTasks + stats.pendingTasks}
            hint={`${stats.totalTasks} total assigned`}
            icon="users"
            accent="primary"
          />
        )}
        <StatCardIcon
          title={stats.viewMode === "team" ? "Present today" : "Checked in today"}
          value={stats.viewMode === "team" ? stats.presentToday : stats.presentToday > 0 ? "Yes" : "No"}
          hint={
            stats.viewMode === "team"
              ? `${stats.attendanceRate}% attendance rate`
              : "Mark attendance from the Attendance page"
          }
          icon="clock"
          trend={`${stats.lateThisMonth} late this month`}
          accent="secondary"
        />
        <StatCardIcon
          title="Task completion"
          value={`${stats.taskCompletion}%`}
          hint={`${stats.completedTasks}/${stats.totalTasks} completed`}
          icon="check"
          accent="brand"
        />
        <StatCardIcon
          title={stats.viewMode === "team" ? "Pending leave" : "My pending leave"}
          value={stats.pendingLeaves}
          hint={`${stats.inProgressTasks} tasks in progress`}
          icon="calendar"
          accent="primary"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/80 lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Attendance trend (7 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceTrendChart data={charts.attendanceTrend} />
          </CardContent>
        </Card>
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="font-heading text-base">Task breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskBreakdownChart data={charts.taskBreakdown} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Attendance this month
            </CardTitle>
          </CardHeader>
          <CardContent>
            {charts.attendanceBreakdown.length > 0 ? (
              <AttendanceStatusChart data={charts.attendanceBreakdown} />
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No attendance data yet this month.
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Leave requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {charts.leaveBreakdown.length > 0 ? (
              <LeaveStatusChart data={charts.leaveBreakdown} />
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No leave requests yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <QuickActions role={member.role} />
        <RecentActivity {...activity} />
        <TeamPulse
          attendanceRate={stats.attendanceRate}
          taskCompletion={stats.taskCompletion}
          presentToday={stats.presentToday}
          employees={stats.employees}
          lateThisMonth={stats.lateThisMonth}
          openTasks={openTasks}
        />
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
