"use client";

import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';

import { CellAction } from './cell-action';

import type { TRoom } from "@repo/db";
import type { Column, ColumnDef } from "@tanstack/react-table";

const statusMap: Record<string, string> = {
  available: "Available",
  occupied: "Occupied",
  maintenance: "Maintenance",
  blocked: "Blocked",
};

const statusVariantMap = {
  available: "default",
  occupied: "secondary",
  maintenance: "destructive",
  blocked: "outline",
} as const;

export const columns: ColumnDef<TRoom>[] = [
  {
    accessorKey: "room_number",
    cell: ({ row }) => {
      const room = row.original;
      return (
        <div className="flex flex-col">
          <Link
            href={`/rooms/${room.id}`}
            className="font-medium font-mono hover:underline cursor-pointer"
          >
            {room.room_number}
          </Link>
          <div className="text-sm text-muted-foreground">Floor {room.floor}</div>
        </div>
      );
    },
    enableColumnFilter: true,
    header: ({ column }: { column: Column<TRoom, unknown> }) => (
      <DataTableColumnHeader column={column} title="Room Number" />
    ),
    id: "room_number",
    meta: {
      icon: null,
      label: "Room Number",
      placeholder: "Search by room number...",
      variant: "text",
    },
  },
  {
    accessorKey: "roomType",
    cell: ({ row }) => {
      const roomType = row.original.roomType;
      return (
        <div className="flex flex-col">
          <div className="font-medium">{roomType?.name || "N/A"}</div>
          <div className="text-sm text-muted-foreground">
            Max {roomType?.max_occupancy || 0} guests
          </div>
        </div>
      );
    },
    header: "Room Type",
    id: "room_type",
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
    header: ({ column }: { column: Column<TRoom, unknown> }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    id: "status",
    meta: {
      label: "Status",
      options: [
        { label: "Available", value: "available" },
        { label: "Occupied", value: "occupied" },
        { label: "Maintenance", value: "maintenance" },
        { label: "Blocked", value: "blocked" },
      ],
      variant: "select",
    },
  },
  {
    accessorKey: "notes",
    cell: ({ row }) => {
      const notes = row.original.notes;
      return (
        <div className="max-w-[300px] truncate text-sm text-muted-foreground">
          {notes || "—"}
        </div>
      );
    },
    header: "Notes",
    id: "notes",
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
    header: ({ column }: { column: Column<TRoom, unknown> }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    id: "created_at",
  },
  {
    cell: ({ row }) => <CellAction data={row.original} />,
    id: "actions",
  },
];

