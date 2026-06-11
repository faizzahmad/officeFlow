import { Suspense } from "react";

import {
  getAttendanceCalendar,
  getAttendanceFilterEmployees,
  getAttendanceRecords,
  getAttendanceSummary,
  getTodayAttendanceStatus,
} from "@/actions/attendance";
import { AttendanceActions } from "@/components/attendance-actions";
import { AttendanceCalendar } from "@/components/attendance/attendance-calendar";
import { AttendanceFilters } from "@/components/attendance/attendance-filters";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatWorkHours, parseAttendanceFilters } from "@/lib/attendance";
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
            ? "Filter by employee and date, view calendar hours, and browse session logs."
            : "Check in with your location and track your work hours on the calendar."
        }
      >
        {todayStatus ? <AttendanceActions status={todayStatus} /> : null}
      </PageHeader>

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

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title={permissions.canViewTeamAttendance ? "Present" : "My present days"}
          value={summaryMap.present ?? 0}
        />
        <StatCard
          title={permissions.canViewTeamAttendance ? "Late" : "My late days"}
          value={summaryMap.late ?? 0}
        />
        <StatCard
          title={permissions.canViewTeamAttendance ? "Half day" : "My half days"}
          value={summaryMap.half_day ?? 0}
        />
        <StatCard
          title={permissions.canViewTeamAttendance ? "Absent" : "My absent days"}
          value={summaryMap.absent ?? 0}
        />
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Session log</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                {permissions.canViewTeamAttendance ? (
                  <TableHead>Employee</TableHead>
                ) : null}
                <TableHead>Check in</TableHead>
                <TableHead>Check out</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={permissions.canViewTeamAttendance ? 7 : 6}
                    className="text-center text-muted-foreground"
                  >
                    No attendance records for this filter.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((row) => (
                  <TableRow key={row.record.id}>
                    <TableCell>{row.record.date}</TableCell>
                    {permissions.canViewTeamAttendance ? (
                      <TableCell>
                        {row.userName} ({row.employeeCode})
                      </TableCell>
                    ) : null}
                    <TableCell>
                      {row.record.checkIn
                        ? new Date(row.record.checkIn).toLocaleTimeString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {row.record.checkOut
                        ? new Date(row.record.checkOut).toLocaleTimeString()
                        : "—"}
                    </TableCell>
                    <TableCell>{formatWorkHours(row.record.workHours)}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {row.record.checkInLatitude && row.record.checkInLongitude
                        ? `${Number(row.record.checkInLatitude).toFixed(4)}, ${Number(row.record.checkInLongitude).toFixed(4)}`
                        : "—"}
                    </TableCell>
                    <TableCell className="capitalize">{row.record.status}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
