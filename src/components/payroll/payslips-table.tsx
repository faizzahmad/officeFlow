"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { DownloadPayslipButton } from "@/components/download-payslip-button";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { ButtonLink } from "@/components/ui/button";
import type { payslips } from "@/db/schema";
import { formatCurrency } from "@/lib/payroll";

type PayslipRow = {
  payslip: typeof payslips.$inferSelect;
  userName: string;
};

export function PayslipsTable({
  data,
  showEmployee,
}: {
  data: PayslipRow[];
  showEmployee: boolean;
}) {
  const columns: ColumnDef<PayslipRow>[] = [
    {
      accessorKey: "payslip.slipNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Slip" />
      ),
      cell: ({ row }) => row.original.payslip.slipNumber,
    },
    ...(showEmployee
      ? [
          {
            accessorKey: "userName",
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="Employee" />
            ),
          } satisfies ColumnDef<PayslipRow>,
        ]
      : []),
    {
      accessorKey: "payslip.netSalary",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Net salary" />
      ),
      cell: ({ row }) => formatCurrency(row.original.payslip.netSalary),
    },
    {
      id: "actions",
      enableSorting: false,
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          <ButtonLink
            variant="outline"
            size="sm"
            href={`/payroll/payslips/${row.original.payslip.id}`}
          >
            <Eye className="size-4" />
            View
          </ButtonLink>
          <DownloadPayslipButton payslipId={row.original.payslip.id} />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Search salary slips..."
      emptyMessage="No salary slips found."
    />
  );
}
