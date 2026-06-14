"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, MapPin } from "lucide-react";

import { AttendanceStatusBadge } from "@/components/attendance/attendance-status-badge";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { attendanceRecords } from "@/db/schema";
import {
  formatAttendanceDate,
  formatAttendanceTime,
  formatWorkHours,
  getAttendanceMapLink,
} from "@/lib/attendance";

type AttendanceRecord = typeof attendanceRecords.$inferSelect;

export type AttendanceSessionRow = {
  record: AttendanceRecord;
  userName: string;
  employeeCode: string;
};

export function AttendanceSessionTable({
  data,
  showEmployee,
}: {
  data: AttendanceSessionRow[];
  showEmployee: boolean;
}) {
  const columns: ColumnDef<AttendanceSessionRow>[] = [
    {
      accessorKey: "record.date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">
          {formatAttendanceDate(row.original.record.date)}
        </span>
      ),
    },
    ...(showEmployee
      ? [
          {
            accessorKey: "userName",
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="Employee" />
            ),
            cell: ({ row }) => (
              <div>
                <div className="font-medium">{row.original.userName}</div>
                <div className="text-xs text-muted-foreground">
                  {row.original.employeeCode}
                </div>
              </div>
            ),
          } satisfies ColumnDef<AttendanceSessionRow>,
        ]
      : []),
    {
      id: "checkIn",
      accessorFn: (row) =>
        row.record.checkIn ? formatAttendanceTime(row.record.checkIn) : "",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Check in" />
      ),
      cell: ({ row }) => formatAttendanceTime(row.original.record.checkIn),
    },
    {
      id: "checkOut",
      accessorFn: (row) =>
        row.record.checkOut ? formatAttendanceTime(row.record.checkOut) : "",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Check out" />
      ),
      cell: ({ row }) => formatAttendanceTime(row.original.record.checkOut),
    },
    {
      accessorKey: "record.workHours",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Duration" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">
          {formatWorkHours(row.original.record.workHours)}
        </span>
      ),
    },
    {
      id: "location",
      enableSorting: false,
      header: "Location",
      cell: ({ row }) => {
        const mapLink = getAttendanceMapLink(
          row.original.record.checkInLatitude,
          row.original.record.checkInLongitude,
        );

        return mapLink ? (
          <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <MapPin className="size-3.5" />
            View map
            <ExternalLink className="size-3" />
          </a>
        ) : (
          <span className="text-xs text-muted-foreground">Not recorded</span>
        );
      },
    },
    {
      accessorKey: "record.status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <AttendanceStatusBadge status={row.original.record.status} />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Search time entries..."
      emptyMessage="No time entries for this period."
    />
  );
}
