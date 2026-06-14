import { Suspense } from "react";

import {
  getAttendanceCalendar,
  getAttendanceFilterEmployees,
  getAttendanceRecords,
  getAttendanceSummary,
  getTodayAttendanceStatus,
} from "@/actions/attendance";
import { AttendanceCalendar } from "@/components/attendance/attendance-calendar";
import { AttendanceFilters } from "@/components/attendance/attendance-filters";
import { AttendanceSessionLog } from "@/components/attendance/attendance-session-log";
import { AttendanceTodayCard } from "@/components/attendance/attendance-today-card";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatAttendancePeriod,
  parseAttendanceFilters,
} from "@/lib/attendance";
import { getRolePermissions, requireWorkspace } from "@/lib/session";

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const { member, employee } = await requireWorkspace();
  const permissions = getRolePermissions(member.role);
  const now = new Date();

  const filters = parseAttendanceFilters(params, {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    employeeId: permissions.canViewTeamAttendance
      ? "all"
      : employee?.id,
  });

  const teamView =
    permissions.canViewTeamAttendance &&
    (!filters.employeeId || filters.employeeId === "all");

  const periodLabel = formatAttendancePeriod(filters);

  const [records, summary, todayStatus, calendarData, filterEmployees] =
    await Promise.all([
      getAttendanceRecords(filters),
      getAttendanceSummary(filters),
      getTodayAttendanceStatus(),
      getAttendanceCalendar(filters),
      permissions.canViewTeamAttendance
        ? getAttendanceFilterEmployees()
        : Promise.resolve([]),
    ]);

  const summaryMap = Object.fromEntries(
    summary.map((row) => [row.status, row.count]),
  );

  const selectedEmployee = filterEmployees.find(
    (item) => item.id === filters.employeeId,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description={
          permissions.canViewTeamAttendance
            ? "Monitor team presence, review time entries, and track monthly attendance trends."
            : "Check in for the day, review your hours, and track attendance over time."
        }
      />

      {todayStatus ? <AttendanceTodayCard status={todayStatus} /> : null}

      <Suspense
        fallback={
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              Loading filters...
            </CardContent>
          </Card>
        }
      >
        <AttendanceFilters
          employees={filterEmployees}
          canViewTeam={permissions.canViewTeamAttendance}
          month={filters.month}
          year={filters.year}
          employeeId={filters.employeeId ?? "all"}
          startDate={filters.startDate}
          endDate={filters.endDate}
        />
      </Suspense>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title={permissions.canViewTeamAttendance ? "Present days" : "My present days"}
          value={summaryMap.present ?? 0}
          hint={periodLabel}
          accent="brand"
        />
        <StatCard
          title={permissions.canViewTeamAttendance ? "Late arrivals" : "My late days"}
          value={summaryMap.late ?? 0}
          hint={periodLabel}
        />
        <StatCard
          title={permissions.canViewTeamAttendance ? "Half days" : "My half days"}
          value={summaryMap.half_day ?? 0}
          hint={periodLabel}
          accent="secondary"
        />
        <StatCard
          title={permissions.canViewTeamAttendance ? "Absences" : "My absences"}
          value={summaryMap.absent ?? 0}
          hint={periodLabel}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(320px,420px)_1fr]">
        <Suspense
          fallback={
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                Loading calendar...
              </CardContent>
            </Card>
          }
        >
          <AttendanceCalendar
            calendarData={calendarData}
            month={filters.month}
            year={filters.year}
            teamView={teamView}
            selectedEmployeeName={selectedEmployee?.name}
          />
        </Suspense>

        <AttendanceSessionLog
          records={records}
          showEmployee={permissions.canViewTeamAttendance}
          periodLabel={periodLabel}
        />
      </div>
    </div>
  );
}
