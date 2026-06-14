"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { employees } from "@/db/schema";
import { formatCurrency } from "@/lib/payroll";

type EmployeeRow = {
  employee: typeof employees.$inferSelect;
  departmentName: string | null;
  userName: string;
  userEmail: string;
  memberRole: string;
};

const columns: ColumnDef<EmployeeRow>[] = [
  {
    accessorKey: "employee.employeeCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    cell: ({ row }) => row.original.employee.employeeCode,
  },
  {
    accessorKey: "userName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "userEmail",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "memberRole",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => (
      <span className="capitalize">{row.original.memberRole}</span>
    ),
  },
  {
    accessorKey: "departmentName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => row.original.departmentName ?? "—",
  },
  {
    accessorKey: "employee.designation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Designation" />
    ),
    cell: ({ row }) => row.original.employee.designation ?? "—",
  },
  {
    accessorKey: "employee.baseSalary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Salary" />
    ),
    cell: ({ row }) => formatCurrency(row.original.employee.baseSalary),
  },
];

export function EmployeesTable({ data }: { data: EmployeeRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Search employees..."
      emptyMessage="No employees found."
    />
  );
}
