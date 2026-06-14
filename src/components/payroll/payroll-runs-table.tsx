"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { payrollRuns } from "@/db/schema";

type PayrollRunRow = typeof payrollRuns.$inferSelect;

const columns: ColumnDef<PayrollRunRow>[] = [
  {
    id: "period",
    accessorFn: (row) => `${row.month}/${row.year}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Period" />
    ),
    cell: ({ row }) => `${row.original.month}/${row.original.year}`,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <span className="capitalize">{row.original.status}</span>
    ),
  },
];

export function PayrollRunsTable({ data }: { data: PayrollRunRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Search payroll runs..."
      emptyMessage="No payroll runs found."
    />
  );
}
