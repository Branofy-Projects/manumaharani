"use client";

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';

import { CellAction } from './cell-action';

import type { TTestimonial } from "@repo/db";
import type { Column, ColumnDef } from "@tanstack/react-table";

const statusMap: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export const columns: ColumnDef<TTestimonial>[] = [
  {
    accessorKey: "guest_name",
    cell: ({ row }) => {
      const testimonial = row.original;
      return (
        <div className="flex flex-col">
          <div className="font-medium">{testimonial.guest_name}</div>
          <div className="text-sm text-muted-foreground">{testimonial.guest_email || "—"}</div>
        </div>
      );
    },
    enableColumnFilter: true,
    header: ({ column }: { column: Column<TTestimonial, unknown> }) => (
      <DataTableColumnHeader column={column} title="Guest" />
    ),
    id: "guest_name",
    meta: {
      icon: null,
      label: "Guest Name",
      placeholder: "Search by guest name...",
      variant: "text",
    },
  },
  {
    accessorKey: "rating",
    cell: ({ row }) => {
      const rating = row.original.rating;
      return <div className="font-medium">{rating} ⭐</div>;
    },
    header: "Rating",
    id: "rating",
  },
  {
    accessorKey: "comment",
    cell: ({ row }) => {
      const comment = row.original.comment;
      return (
        <div className="max-w-[400px] truncate text-sm text-muted-foreground">
          {comment || "—"}
        </div>
      );
    },
    header: "Comment",
    id: "comment",
  },
  {
    accessorKey: "status",
    cell: ({ cell }) => {
      const statusValue = cell.row.original.status;
      return (
        <Badge variant={statusValue === "approved" ? "default" : statusValue === "rejected" ? "destructive" : "secondary"}>
          {statusMap[statusValue as string] || statusValue}
        </Badge>
      );
    },
    enableColumnFilter: true,
    header: ({ column }: { column: Column<TTestimonial, unknown> }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    id: "status",
    meta: {
      label: "Status",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
      ],
      variant: "select",
    },
  },
  {
    accessorKey: "created_at",
    cell: ({ cell }) => {
      const date = cell.getValue<string>();
      return (
        <div className="text-sm text-muted-foreground">
          {new Date(date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      );
    },
    header: ({ column }: { column: Column<TTestimonial, unknown> }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    id: "created_at",
  },
  {
    cell: ({ row }) => <CellAction data={row.original} />,
    id: "actions",
  },
];

