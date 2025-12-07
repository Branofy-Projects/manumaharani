"use client";

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';

import { CellAction } from './cell-action';

import type { TRoomType } from "@repo/db";
import type { Column, ColumnDef } from "@tanstack/react-table";

const statusMap: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
};

const statusVariantMap = {
  active: "default",
  inactive: "secondary",
} as const;

export const columns: ColumnDef<TRoomType>[] = [
  {
    accessorKey: "name",
    cell: ({ row }) => {
      const roomType = row.original;
      return (
        <div className="flex flex-col">
          <div className="font-medium">{roomType.name}</div>
          <div className="text-sm text-muted-foreground">{roomType.slug}</div>
        </div>
      );
    },
    enableColumnFilter: true,
    header: ({ column }: { column: Column<TRoomType, unknown> }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    id: "name",
    meta: {
      icon: null,
      label: "Name",
      placeholder: "Search by name...",
      variant: "text",
    },
  },
  {
    accessorKey: "description",
    cell: ({ row }) => {
      const description = row.original.description;
      return (
        <div className="max-w-[300px] truncate text-sm text-muted-foreground">
          {description}
        </div>
      );
    },
    header: ({ column }: { column: Column<TRoomType, unknown> }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    id: "description",
  },
  {
    accessorKey: "base_price",
    cell: ({ row }) => {
      const price = Number(row.original.base_price);
      return (
        <div className="font-medium">
          ₹{price.toLocaleString('en-IN')}
        </div>
      );
    },
    header: ({ column }: { column: Column<TRoomType, unknown> }) => (
      <DataTableColumnHeader column={column} title="Base Price" />
    ),
    id: "base_price",
  },
  {
    accessorKey: "max_occupancy",
    cell: ({ row }) => {
      return <div>{row.original.max_occupancy} guests</div>;
    },
    header: ({ column }: { column: Column<TRoomType, unknown> }) => (
      <DataTableColumnHeader column={column} title="Max Occupancy" />
    ),
    id: "max_occupancy",
  },
  {
    accessorKey: "status",
    cell: ({ cell }) => {
      const statusValue = cell.row.original.status;
      return (
        <Badge
          variant={statusVariantMap[statusValue as keyof typeof statusVariantMap] || "secondary"}
        >
          {statusMap[statusValue as string] || statusValue}
        </Badge>
      );
    },
    enableColumnFilter: true,
    header: ({ column }: { column: Column<TRoomType, unknown> }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    id: "status",
    meta: {
      label: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
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
    header: ({ column }: { column: Column<TRoomType, unknown> }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    id: "created_at",
  },
  {
    cell: ({ row }) => <CellAction data={row.original} />,
    id: "actions",
  },
];

