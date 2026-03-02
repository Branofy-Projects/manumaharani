"use client";

import {
  deleteNotificationRecipient,
  updateNotificationRecipient,
} from "@repo/actions";
import {
  Edit,
  MoreHorizontal,
  Power,
  PowerOff,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { NotificationRecipientForm } from "../notification-recipient-form";

import type { TNotificationRecipient } from "@repo/db/schema/notification-recipients.schema";

interface CellActionProps {
  data: TNotificationRecipient;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [isPending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);
  const router = useRouter();

  const onToggleActive = () => {
    const newStatus = !data.is_active;
    if (!confirm(`${newStatus ? "Activate" : "Deactivate"} this recipient?`)) {
      return;
    }

    startTransition(async () => {
      try {
        await updateNotificationRecipient(data.id, { is_active: newStatus });
        toast.success(`Recipient ${newStatus ? "activated" : "deactivated"}`);
        router.refresh();
      } catch {
        toast.error("Failed to update recipient");
      }
    });
  };

  const onDelete = () => {
    if (!confirm("Are you sure you want to delete this recipient? This action cannot be undone.")) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteNotificationRecipient(data.id);
        toast.success("Recipient deleted");
        router.refresh();
      } catch {
        toast.error("Failed to delete recipient");
      }
    });
  };

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
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem disabled={isPending} onClick={onToggleActive}>
            {data.is_active ? (
              <>
                <PowerOff className="mr-2 h-4 w-4" /> Deactivate
              </>
            ) : (
              <>
                <Power className="mr-2 h-4 w-4" /> Activate
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            disabled={isPending}
            onClick={onDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <NotificationRecipientForm
        data={data}
        onOpenChange={setEditOpen}
        open={editOpen}
      />
    </>
  );
};
