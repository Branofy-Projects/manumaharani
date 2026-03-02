"use client";

import { cancelBooking, updateBookingStatus } from '@repo/actions';
import {
  ArrowRightCircle,
  Ban,
  CheckCircle,
  Copy,
  Edit,
  LogIn,
  LogOut,
  MoreHorizontal,
  UserX,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub,
  DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import type { TBooking } from "@repo/db";

type BookingStatus = "cancelled" | "checked_in" | "checked_out" | "confirmed" | "no_show" | "pending";

const STATUS_OPTIONS: { icon: React.ReactNode; label: string; value: BookingStatus }[] = [
  { icon: <ArrowRightCircle className="mr-2 h-4 w-4" />, label: "Pending", value: "pending" },
  { icon: <CheckCircle className="mr-2 h-4 w-4" />, label: "Confirmed", value: "confirmed" },
  { icon: <LogIn className="mr-2 h-4 w-4" />, label: "Checked In", value: "checked_in" },
  { icon: <LogOut className="mr-2 h-4 w-4" />, label: "Checked Out", value: "checked_out" },
  { icon: <Ban className="mr-2 h-4 w-4" />, label: "Cancelled", value: "cancelled" },
  { icon: <UserX className="mr-2 h-4 w-4" />, label: "No Show", value: "no_show" },
];

interface CellActionProps {
  data: TBooking;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onStatusChange = (status: BookingStatus) => {
    const statusLabel = STATUS_OPTIONS.find((s) => s.value === status)?.label || status;

    if (!confirm(`Change booking "${data.confirmation_code}" status to "${statusLabel}"?`)) {
      return;
    }

    startTransition(async () => {
      try {
        if (status === "cancelled") {
          await cancelBooking(data.id);
        } else {
          await updateBookingStatus(data.id, status);
        }
        toast.success(`Booking status updated to ${statusLabel}`);
        router.refresh();
      } catch {
        toast.error("Failed to update booking status");
      }
    });
  };

  const onCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Confirmation code copied to clipboard");
  };

  const currentStatus = data.booking_status as BookingStatus;
  const availableStatuses = STATUS_OPTIONS.filter((s) => s.value !== currentStatus);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button className="h-8 w-8 p-0" disabled={isPending} variant="ghost">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onCopy(data.confirmation_code)}>
          <Copy className="mr-2 h-4 w-4" /> Copy Code
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/bookings/${data.id}`)}>
          <Edit className="mr-2 h-4 w-4" /> View Details
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
                    status.value === "cancelled" || status.value === "no_show"
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
  );
};
