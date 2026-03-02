"use client";

import Link from "next/link";

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';

import { CellAction } from './cell-action';

import type { TAmenity } from "@repo/db";
import type { Column, ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TAmenity>[] = [
  {
    accessorKey: "label",
    cell: ({ row }) => {
      const amenity = row.original;
      return (
        <Link className="hover:underline" href={`/amenities/${amenity.id}`}>
          <div className="font-medium">{amenity.label}</div>
        </Link>
      );
    },
    enableColumnFilter: true,
    header: ({ column }: { column: Column<TAmenity, unknown> }) => (
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

