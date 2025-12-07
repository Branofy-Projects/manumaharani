"use client";

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';

import { CellAction } from './cell-action';

import type { TBooking } from "@repo/db";
import type { Column, ColumnDef } from "@tanstack/react-table";

const statusMap: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  checked_in: "Checked In",
  checked_out: "Checked Out",
  cancelled: "Cancelled",
};

const paymentStatusMap: Record<string, string> = {
  pending: "Pending",
  partial: "Partial",
  paid: "Paid",
  refunded: "Refunded",
};

export const columns: ColumnDef<TBooking>[] = [
  {
    accessorKey: "confirmation_code",
    cell: ({ row }) => {
      return (
        <div className="font-mono font-medium">{row.original.confirmation_code}</div>
      );
    },
    enableColumnFilter: true,
    header: ({ column }: { column: Column<TBooking, unknown> }) => (
      <DataTableColumnHeader column={column} title="Confirmation Code" />
    ),
    id: "confirmation_code",
    meta: {
      icon: null,
      label: "Confirmation Code",
      placeholder: "Search by code...",
      variant: "text",
    },
  },
  {
    accessorKey: "guest_name",
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div className="flex flex-col">
          <div className="font-medium">{booking.guest_name}</div>
          <div className="text-sm text-muted-foreground">{booking.guest_email}</div>
        </div>
      );
    },
    header: "Guest",
    id: "guest",
  },
  {
    accessorKey: "roomType",
    cell: ({ row }) => {
      const roomType = row.original.roomType;
      return <div>{roomType?.name || "N/A"}</div>;
    },
    header: "Room Type",
    id: "room_type",
  },
  {
    accessorKey: "check_in_date",
    cell: ({ row }) => {
      const date = row.original.check_in_date;
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
    header: "Check In",
    id: "check_in",
  },
  {
    accessorKey: "check_out_date",
    cell: ({ row }) => {
      const date = row.original.check_out_date;
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
    header: "Check Out",
    id: "check_out",
  },
  {
    accessorKey: "booking_status",
    cell: ({ cell }) => {
      const statusValue = cell.row.original.booking_status;
      return (
        <Badge variant="outline">
          {statusMap[statusValue as string] || statusValue}
        </Badge>
      );
    },
    enableColumnFilter: true,
    header: ({ column }: { column: Column<TBooking, unknown> }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    id: "status",
    meta: {
      label: "Status",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Checked In", value: "checked_in" },
        { label: "Checked Out", value: "checked_out" },
        { label: "Cancelled", value: "cancelled" },
      ],
      variant: "select",
    },
  },
  {
    accessorKey: "payment_status",
    cell: ({ cell }) => {
      const statusValue = cell.row.original.payment_status;
      return (
        <Badge variant={statusValue === "paid" ? "default" : "secondary"}>
          {paymentStatusMap[statusValue as string] || statusValue}
        </Badge>
      );
    },
    enableColumnFilter: true,
    header: ({ column }: { column: Column<TBooking, unknown> }) => (
      <DataTableColumnHeader column={column} title="Payment" />
    ),
    id: "payment_status",
    meta: {
      label: "Payment Status",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Partial", value: "partial" },
        { label: "Paid", value: "paid" },
        { label: "Refunded", value: "refunded" },
      ],
      variant: "select",
    },
  },
  {
    accessorKey: "total_amount",
    cell: ({ row }) => {
      const amount = Number(row.original.total_amount);
      return <div className="font-medium">₹{amount.toLocaleString('en-IN')}</div>;
    },
    header: "Total Amount",
    id: "total_amount",
  },
  {
    cell: ({ row }) => <CellAction data={row.original} />,
    id: "actions",
  },
];

