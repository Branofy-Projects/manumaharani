"use client";

import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cancelBooking } from '@repo/actions';

import type { TBooking } from "@repo/db";

interface CellActionProps {
  data: TBooking;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onCancel = async () => {
    if (!confirm(`Are you sure you want to cancel booking "${data.confirmation_code}"?`)) {
      return;
    }

    startTransition(async () => {
      try {
        await cancelBooking(data.id);
        toast.success("Booking cancelled successfully");
        router.refresh();
      } catch (error) {
        toast.error("Failed to cancel booking");
      }
    });
  };

  const onCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Confirmation code copied to clipboard");
  };

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
        {data.booking_status !== "cancelled" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              disabled={isPending}
              onClick={onCancel}
            >
              <Trash className="mr-2 h-4 w-4" /> Cancel Booking
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

