"use client";

import Link from "next/link";

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';

import { CellAction } from './cell-action';

import type { TPolicy } from "@repo/db";
import type { Column, ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TPolicy>[] = [
  {
    accessorKey: "label",
    cell: ({ row }) => {
      const policy = row.original;
      return (
        <Link className="hover:underline" href={`/policies/${policy.id}`}>
          <div className="font-medium">{policy.label}</div>
        </Link>
      );
    },
    enableColumnFilter: true,
    header: ({ column }: { column: Column<TPolicy, unknown> }) => (
      <DataTableColumnHeader column={column} title="Label" />
    ),
    id: "label",
    meta: {
      icon: null,
      label: "Label",
      placeholder: "Search by label...",
      variant: "text",
    },
  },
  {
    accessorKey: "kind",
    cell: ({ row }) => {
      const kind = row.original.kind;
      return (
        <Badge variant={kind === "include" ? "default" : "destructive"}>
          {kind === "include" ? "Include" : "Exclude"}
        </Badge>
      );
    },
    header: "Type",
    id: "kind",
  },
  {
    accessorKey: "description",
    cell: ({ row }) => {
      const desc = row.original.description;
      return (
        <div className="max-w-[400px] truncate text-sm text-muted-foreground">
          {desc || "—"}
        </div>
      );
    },
    header: "Description",
    id: "description",
  },
  {
    cell: ({ row }) => <CellAction data={row.original} />,
    id: "actions",
  },
];

