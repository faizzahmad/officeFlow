"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { leaveBalances } from "@/db/schema";

type LeaveBalanceRow = {
  balance: typeof leaveBalances.$inferSelect;
  leaveType: string;
  userName: string;
  employeeCode: string;
};

export function LeaveBalancesTable({
  data,
  showEmployee,
}: {
  data: LeaveBalanceRow[];
  showEmployee: boolean;
}) {
  const columns: ColumnDef<LeaveBalanceRow>[] = [
    ...(showEmployee
      ? [
          {
            accessorKey: "userName",
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="Employee" />
            ),
          } satisfies ColumnDef<LeaveBalanceRow>,
        ]
      : []),
    {
      accessorKey: "leaveType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
    },
    {
      accessorKey: "balance.usedDays",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Used" />
      ),
      cell: ({ row }) => row.original.balance.usedDays,
    },
    {
      accessorKey: "balance.totalDays",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total" />
      ),
      cell: ({ row }) => row.original.balance.totalDays,
    },
    {
      id: "remaining",
      accessorFn: (row) => row.balance.totalDays - row.balance.usedDays,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Remaining" />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Search leave balances..."
      emptyMessage="No leave balances found."
    />
  );
}
