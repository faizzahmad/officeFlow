"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { performanceReviews } from "@/db/schema";

type PerformanceReviewRow = {
  review: typeof performanceReviews.$inferSelect;
  userName: string;
};

const columns: ColumnDef<PerformanceReviewRow>[] = [
  {
    accessorKey: "userName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee" />
    ),
  },
  {
    accessorKey: "review.period",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Period" />
    ),
    cell: ({ row }) => row.original.review.period,
  },
  {
    accessorKey: "review.score",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Score" />
    ),
    cell: ({ row }) => row.original.review.score,
  },
];

export function PerformanceReviewsTable({
  data,
}: {
  data: PerformanceReviewRow[];
}) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Search performance reviews..."
      emptyMessage="No performance reviews found."
    />
  );
}
