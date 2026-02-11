"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";

import { CellAction } from "./cell-action";

import type { TContactQuery } from "@repo/db/schema/contact-queries.schema";
import type { Column, ColumnDef } from "@tanstack/react-table";

const statusMap: Record<string, string> = {
  closed: "Closed",
  contacted: "Contacted",
  pending: "Pending",
  resolved: "Resolved",
};

export const columns: ColumnDef<TContactQuery>[] = [
  {
    accessorKey: "name",
    cell: ({ row }) => {
      const query = row.original;
      return (
        <div className="flex flex-col">
          <div className="font-medium">{query.name}</div>
          <div className="text-sm text-muted-foreground">{query.email}</div>
        </div>
      );
    },
    enableColumnFilter: true,
    header: ({ column }: { column: Column<TContactQuery, unknown> }) => (
      <DataTableColumnHeader column={column} title="Contact" />
    ),
    id: "name",
    meta: {
      label: "Contact",
      placeholder: "Search by name or email...",
      variant: "text" as const,
    },
  },
  {
    accessorKey: "phone",
    cell: ({ row }) => <div className="text-sm">{row.original.phone}</div>,
    header: "Phone",
    id: "phone",
  },
  {
    accessorKey: "subject",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate text-sm">{row.original.subject}</div>
    ),
    header: "Subject",
    id: "subject",
  },
  {
    accessorKey: "status",
    cell: ({ cell }) => {
      const statusValue = cell.row.original.status;
      const variant =
        statusValue === "resolved"
          ? "default"
          : statusValue === "closed"
            ? "destructive"
            : "secondary";
      return (
        <Badge variant={variant}>
          {statusMap[statusValue as string] || statusValue}
        </Badge>
      );
    },
    enableColumnFilter: true,
    header: ({ column }: { column: Column<TContactQuery, unknown> }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    id: "status",
    meta: {
      label: "Status",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Contacted", value: "contacted" },
        { label: "Resolved", value: "resolved" },
        { label: "Closed", value: "closed" },
      ],
      variant: "select" as const,
    },
  },
  {
    accessorKey: "created_at",
    cell: ({ row }) => {
      const date = row.original.created_at;
      return (
        <div className="text-sm">
          {new Date(date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      );
    },
    header: "Submitted",
    id: "created_at",
  },
  {
    cell: ({ row }) => <CellAction data={row.original} />,
    id: "actions",
  },
];
