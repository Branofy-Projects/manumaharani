"use client";

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';

import { CellAction } from './cell-action';

import type { TGallery } from "@repo/db";
import type { Column, ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TGallery>[] = [
  {
    accessorKey: "title",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex flex-col">
          <div className="font-medium">{item.title || "Untitled"}</div>
          <div className="text-sm text-muted-foreground line-clamp-1">{item.description || "—"}</div>
        </div>
      );
    },
    enableColumnFilter: true,
    header: ({ column }: { column: Column<TGallery, unknown> }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    id: "title",
    meta: {
      icon: null,
      label: "Title",
      placeholder: "Search by title...",
      variant: "text",
    },
  },
  {
    accessorKey: "type",
    cell: ({ row }) => {
      return <Badge variant="outline">{row.original.type || "image"}</Badge>;
    },
    header: "Type",
    id: "type",
  },
  {
    accessorKey: "category",
    cell: ({ row }) => {
      return <div className="text-sm">{row.original.category || "—"}</div>;
    },
    header: "Category",
    id: "category",
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
    header: ({ column }: { column: Column<TGallery, unknown> }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    id: "created_at",
  },
  {
    cell: ({ row }) => <CellAction data={row.original} />,
    id: "actions",
  },
];

