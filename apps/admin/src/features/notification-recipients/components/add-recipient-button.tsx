"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { NotificationRecipientForm } from "./notification-recipient-form";

export function AddRecipientButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> Add Recipient
      </Button>
      <NotificationRecipientForm onOpenChange={setOpen} open={open} />
    </>
  );
}
