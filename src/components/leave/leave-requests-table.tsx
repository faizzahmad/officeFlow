"use client";

import type { ColumnDef } from "@tanstack/react-table";

import {
  approveLeaveFormAction,
  rejectLeaveFormAction,
} from "@/actions/leave-forms";
import { ActionForm } from "@/components/action-form";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import type { leaveRequests } from "@/db/schema";

type LeaveRequestRow = {
  request: typeof leaveRequests.$inferSelect;
  employeeCode: string;
  userName: string;
  leaveType: string;
};

export function LeaveRequestsTable({
  data,
  showEmployee,
  canApprove,
}: {
  data: LeaveRequestRow[];
  showEmployee: boolean;
  canApprove: boolean;
}) {
  const columns: ColumnDef<LeaveRequestRow>[] = [
    ...(showEmployee
      ? [
          {
            accessorKey: "userName",
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="Employee" />
            ),
          } satisfies ColumnDef<LeaveRequestRow>,
        ]
      : []),
    {
      accessorKey: "leaveType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
    },
    {
      id: "dates",
      accessorFn: (row) =>
        `${row.request.startDate} ${row.request.endDate}`,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dates" />
      ),
      cell: ({ row }) => (
        <span>
          {row.original.request.startDate} → {row.original.request.endDate}
        </span>
      ),
    },
    {
      accessorKey: "request.days",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Days" />
      ),
      cell: ({ row }) => row.original.request.days,
    },
    {
      accessorKey: "request.status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.request.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      enableSorting: false,
      header: "Actions",
      cell: ({ row }) =>
        row.original.request.status === "pending" && canApprove ? (
          <div className="flex flex-wrap gap-2">
            <ActionForm
              action={approveLeaveFormAction}
              successMessage="Leave request approved"
              className="inline"
            >
              <input
                type="hidden"
                name="requestId"
                value={row.original.request.id}
              />
              <SubmitButton size="sm" loadingText="Approving...">
                Approve
              </SubmitButton>
            </ActionForm>
            <ActionForm
              action={rejectLeaveFormAction}
              successMessage="Leave request rejected"
              className="inline"
            >
              <input
                type="hidden"
                name="requestId"
                value={row.original.request.id}
              />
              <SubmitButton size="sm" variant="outline" loadingText="Rejecting...">
                Reject
              </SubmitButton>
            </ActionForm>
          </div>
        ) : (
          "—"
        ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Search leave requests..."
      emptyMessage="No leave requests found."
    />
  );
}
