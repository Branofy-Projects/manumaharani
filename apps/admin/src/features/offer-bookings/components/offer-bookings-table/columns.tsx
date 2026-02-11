"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";

import { CellAction } from "./cell-action";

import type { TOfferBooking } from "@repo/db/schema/offer-bookings.schema";
import type { Column, ColumnDef } from "@tanstack/react-table";

type TOfferBookingWithOffer = TOfferBooking & {
  offer: { name: string } | null;
};

const statusMap: Record<string, string> = {
  cancelled: "Cancelled",
  closed: "Closed",
  confirmed: "Confirmed",
  contacted: "Contacted",
  pending: "Pending",
};

export const columns: ColumnDef<TOfferBookingWithOffer>[] = [
  {
    accessorKey: "name",
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div className="flex flex-col">
          <div className="font-medium">{booking.name}</div>
          <div className="text-sm text-muted-foreground">{booking.email}</div>
        </div>
      );
    },
    enableColumnFilter: true,
    header: ({ column }: { column: Column<TOfferBookingWithOffer, unknown> }) => (
      <DataTableColumnHeader column={column} title="Guest" />
    ),
    id: "name",
    meta: {
      label: "Guest",
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
    accessorKey: "offer",
    cell: ({ row }) => {
      const offer = row.original.offer;
      return <div className="max-w-[200px] truncate text-sm">{offer?.name || "N/A"}</div>;
    },
    header: "Offer",
    id: "offer",
  },
  {
    accessorKey: "number_of_guests",
    cell: ({ row }) => <div className="text-sm">{row.original.number_of_guests}</div>,
    header: "Guests",
    id: "number_of_guests",
  },
  {
    accessorKey: "travel_date",
    cell: ({ row }) => {
      const date = row.original.travel_date;
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
    header: "Travel Date",
    id: "travel_date",
  },
  {
    accessorKey: "status",
    cell: ({ cell }) => {
      const statusValue = cell.row.original.status;
      const variant =
        statusValue === "confirmed"
          ? "default"
          : statusValue === "cancelled"
            ? "destructive"
            : statusValue === "closed"
              ? "secondary"
              : "secondary";
      return (
        <Badge variant={variant}>
          {statusMap[statusValue as string] || statusValue}
        </Badge>
      );
    },
    enableColumnFilter: true,
    header: ({ column }: { column: Column<TOfferBookingWithOffer, unknown> }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    id: "status",
    meta: {
      label: "Status",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Contacted", value: "contacted" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Cancelled", value: "cancelled" },
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
