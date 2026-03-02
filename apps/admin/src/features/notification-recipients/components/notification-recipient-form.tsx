"use client";

import {
  createNotificationRecipient,
  updateNotificationRecipient,
} from "@repo/actions";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import type { TNotificationRecipient } from "@repo/db/schema/notification-recipients.schema";

type FormValues = {
  email: string;
  is_active: boolean;
  name: string;
  notify_attraction_bookings: boolean;
  notify_bookings: boolean;
  notify_contact_queries: boolean;
  notify_event_bookings: boolean;
  notify_offer_bookings: boolean;
  notify_room_bookings: boolean;
  phone: string;
};

const NOTIFICATION_TYPES = [
  { key: "notify_room_bookings" as const, label: "Room Bookings" },
  { key: "notify_offer_bookings" as const, label: "Offer Bookings" },
  { key: "notify_event_bookings" as const, label: "Event Bookings" },
  { key: "notify_attraction_bookings" as const, label: "Attraction Bookings" },
  { key: "notify_contact_queries" as const, label: "Contact Queries" },
  { key: "notify_bookings" as const, label: "Direct Bookings" },
];

const defaultValues: FormValues = {
  email: "",
  is_active: true,
  name: "",
  notify_attraction_bookings: true,
  notify_bookings: true,
  notify_contact_queries: true,
  notify_event_bookings: true,
  notify_offer_bookings: true,
  notify_room_bookings: true,
  phone: "",
};

interface NotificationRecipientFormProps {
  data?: TNotificationRecipient | null;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function NotificationRecipientForm({
  data,
  onOpenChange,
  open,
}: NotificationRecipientFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = !!data;

  const form = useForm<FormValues>({
    defaultValues,
  });

  useEffect(() => {
    if (open && data) {
      form.reset({
        email: data.email,
        is_active: data.is_active,
        name: data.name,
        notify_attraction_bookings: data.notify_attraction_bookings,
        notify_bookings: data.notify_bookings,
        notify_contact_queries: data.notify_contact_queries,
        notify_event_bookings: data.notify_event_bookings,
        notify_offer_bookings: data.notify_offer_bookings,
        notify_room_bookings: data.notify_room_bookings,
        phone: data.phone || "",
      });
    } else if (open && !data) {
      form.reset(defaultValues);
    }
  }, [open, data, form]);

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        if (isEditing) {
          await updateNotificationRecipient(data.id, {
            ...values,
            phone: values.phone || null,
          });
          toast.success("Recipient updated successfully");
        } else {
          await createNotificationRecipient({
            ...values,
            phone: values.phone || null,
          });
          toast.success("Recipient added successfully");
        }
        onOpenChange(false);
        router.refresh();
      } catch {
        toast.error(`Failed to ${isEditing ? "update" : "add"} recipient`);
      }
    });
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Recipient" : "Add Recipient"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update notification recipient details."
              : "Add a new recipient to receive booking notification emails."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Front Desk" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              rules={{ required: "Name is required" }}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              rules={{ required: "Email is required" }}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 ..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Active</FormLabel>
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Notification Types</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {NOTIFICATION_TYPES.map((type) => (
                  <FormField
                    control={form.control}
                    key={type.key}
                    name={type.key}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {type.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                disabled={isPending}
                onClick={() => onOpenChange(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button disabled={isPending} type="submit">
                {isPending
                  ? "Saving..."
                  : isEditing
                    ? "Update"
                    : "Add Recipient"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
