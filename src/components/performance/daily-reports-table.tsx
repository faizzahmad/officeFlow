"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { dailyReports } from "@/db/schema";

type DailyReportRow = {
  report: typeof dailyReports.$inferSelect;
  userName: string;
};

const columns: ColumnDef<DailyReportRow>[] = [
  {
    accessorKey: "report.date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => row.original.report.date,
  },
  {
    accessorKey: "userName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee" />
    ),
  },
  {
    accessorKey: "report.summary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Summary" />
    ),
    cell: ({ row }) => (
      <span className="line-clamp-2 max-w-md whitespace-normal">
        {row.original.report.summary}
      </span>
    ),
  },
];

export function DailyReportsTable({ data }: { data: DailyReportRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Search daily reports..."
      emptyMessage="No daily reports found."
    />
  );
}
