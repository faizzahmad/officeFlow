"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import type { EmployeeProfileRow } from "@/lib/employee-profile";
import {
  formatEmployeeDate,
  maskAccountNumber,
  profileCompletionPercent,
} from "@/lib/employee-profile";

const columns: ColumnDef<EmployeeProfileRow>[] = [
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
      <DataTableColumnHeader column={column} title="Employee" />
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.userName}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.userEmail}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "employee.phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => row.original.employee.phone ?? "—",
  },
  {
    accessorKey: "departmentName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => row.original.departmentName ?? "—",
  },
  {
    accessorKey: "employee.dateOfBirth",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="DOB" />
    ),
    cell: ({ row }) => formatEmployeeDate(row.original.employee.dateOfBirth),
  },
  {
    accessorKey: "employee.bankName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bank" />
    ),
    cell: ({ row }) => row.original.employee.bankName ?? "—",
  },
  {
    id: "account",
    accessorFn: (row) => row.employee.bankAccountNumber ?? "",
    header: "Account",
    cell: ({ row }) =>
      maskAccountNumber(row.original.employee.bankAccountNumber),
  },
  {
    id: "completion",
    accessorFn: (row) => profileCompletionPercent(row.employee),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Profile" />
    ),
    cell: ({ row }) => {
      const percent = profileCompletionPercent(row.original.employee);
      return (
        <Badge variant={percent >= 80 ? "outline" : "secondary"}>
          {percent}% complete
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableSorting: false,
    header: "View",
    cell: ({ row }) => (
      <ButtonLink
        variant="outline"
        size="sm"
        href={`/employee-records/${row.original.employee.id}`}
      >
        <Eye className="size-4" />
        Details
      </ButtonLink>
    ),
  },
];

export function EmployeeRecordsTable({ data }: { data: EmployeeProfileRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Search employee records..."
      emptyMessage="No employee records found."
    />
  );
}
