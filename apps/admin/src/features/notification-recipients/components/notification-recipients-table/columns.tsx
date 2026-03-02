"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";

import { CellAction } from "./cell-action";

import type { TNotificationRecipient } from "@repo/db/schema/notification-recipients.schema";
import type { Column, ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TNotificationRecipient>[] = [
  {
    accessorKey: "name",
    cell: ({ row }) => {
      const recipient = row.original;
      return (
        <div className="flex flex-col">
          <div className="font-medium">{recipient.name}</div>
          <div className="text-sm text-muted-foreground">{recipient.email}</div>
        </div>
      );
    },
    enableColumnFilter: true,
    header: ({ column }: { column: Column<TNotificationRecipient, unknown> }) => (
      <DataTableColumnHeader column={column} title="Recipient" />
    ),
    id: "name",
    meta: {
      label: "Recipient",
      placeholder: "Search by name or email...",
      variant: "text" as const,
    },
  },
  {
    accessorKey: "phone",
    cell: ({ row }) => (
      <div className="text-sm">{row.original.phone || "—"}</div>
    ),
    header: "Phone",
    id: "phone",
  },
  {
    accessorKey: "is_active",
    cell: ({ row }) => (
      <Badge variant={row.original.is_active ? "default" : "secondary"}>
        {row.original.is_active ? "Active" : "Inactive"}
      </Badge>
    ),
    header: "Status",
    id: "is_active",
  },
  {
    cell: ({ row }) => {
      const r = row.original;
      const types = [
        r.notify_room_bookings && "Rooms",
        r.notify_offer_bookings && "Offers",
        r.notify_event_bookings && "Events",
        r.notify_attraction_bookings && "Attractions",
        r.notify_contact_queries && "Contacts",
        r.notify_bookings && "Bookings",
      ].filter(Boolean);

      if (types.length === 6) {
        return <span className="text-sm text-muted-foreground">All</span>;
      }

      return (
        <div className="flex flex-wrap gap-1">
          {types.map((type) => (
            <Badge className="text-xs" key={type as string} variant="outline">
              {type}
            </Badge>
          ))}
          {types.length === 0 && (
            <span className="text-sm text-muted-foreground">None</span>
          )}
        </div>
      );
    },
    header: "Notifications",
    id: "notifications",
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
    header: "Added",
    id: "created_at",
  },
  {
    cell: ({ row }) => <CellAction data={row.original} />,
    id: "actions",
  },
];
