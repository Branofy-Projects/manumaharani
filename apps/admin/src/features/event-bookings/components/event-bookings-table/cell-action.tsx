"use client";

import { updateEventBookingStatus } from "@repo/actions";
import {
  ArrowRightCircle,
  Ban,
  CheckCircle,
  Eye,
  MoreHorizontal,
  Phone,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { TEventBooking } from "@repo/db/schema/event-bookings.schema";

type EventBookingStatus = "cancelled" | "closed" | "confirmed" | "contacted" | "pending";

type TEventBookingWithEvent = TEventBooking & {
  event: { name: string } | null;
};

const STATUS_OPTIONS: { icon: React.ReactNode; label: string; value: EventBookingStatus }[] = [
  { icon: <ArrowRightCircle className="mr-2 h-4 w-4" />, label: "Pending", value: "pending" },
  { icon: <Phone className="mr-2 h-4 w-4" />, label: "Contacted", value: "contacted" },
  { icon: <CheckCircle className="mr-2 h-4 w-4" />, label: "Confirmed", value: "confirmed" },
  { icon: <Ban className="mr-2 h-4 w-4" />, label: "Cancelled", value: "cancelled" },
  { icon: <XCircle className="mr-2 h-4 w-4" />, label: "Closed", value: "closed" },
];

const statusMap: Record<string, string> = {
  cancelled: "Cancelled",
  closed: "Closed",
  confirmed: "Confirmed",
  contacted: "Contacted",
  pending: "Pending",
};

interface CellActionProps {
  data: TEventBookingWithEvent;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [isPending, startTransition] = useTransition();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const router = useRouter();

  const onStatusChange = (status: EventBookingStatus) => {
    const statusLabel = STATUS_OPTIONS.find((s) => s.value === status)?.label || status;

    if (!confirm(`Change booking status to "${statusLabel}"?`)) {
      return;
    }

    startTransition(async () => {
      try {
        await updateEventBookingStatus(data.id, status);
        toast.success(`Status updated to ${statusLabel}`);
        router.refresh();
      } catch {
        toast.error("Failed to update status");
      }
    });
  };

  const currentStatus = data.status as EventBookingStatus;
  const availableStatuses = STATUS_OPTIONS.filter((s) => s.value !== currentStatus);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0" disabled={isPending} variant="ghost">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setDetailsOpen(true)}>
            <Eye className="mr-2 h-4 w-4" /> View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger disabled={isPending}>
              <ArrowRightCircle className="mr-2 h-4 w-4" />
              Change Status
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {availableStatuses.map((status) => (
                  <DropdownMenuItem
                    className={
                      status.value === "cancelled" || status.value === "closed"
                        ? "text-red-600 focus:text-red-600"
                        : ""
                    }
                    disabled={isPending}
                    key={status.value}
                    onClick={() => onStatusChange(status.value)}
                  >
                    {status.icon} {status.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog onOpenChange={setDetailsOpen} open={detailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Event Booking Details</DialogTitle>
            <DialogDescription>
              {data.event?.name || "Event booking"} request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{data.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{data.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">{data.phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Guests</p>
                <p className="font-medium">{data.number_of_guests}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge
                  className="mt-1"
                  variant={
                    data.status === "confirmed"
                      ? "default"
                      : data.status === "cancelled"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {statusMap[data.status] || data.status}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Message</p>
              <p className="mt-1 text-sm whitespace-pre-wrap">{data.message}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Submitted</p>
              <p className="mt-1 text-sm">
                {new Date(data.created_at).toLocaleDateString("en-US", {
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
