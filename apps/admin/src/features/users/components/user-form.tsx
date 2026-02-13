"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import PageContainer from "@/components/layout/page-container";
import { zodResolver } from "@/lib/zod-resolver";
import { createUser, updateUser } from "@repo/actions";
import { AppResponseHandler } from "@repo/actions/utils/app-response-handler";

import type { TUser } from "@repo/db/schema/auth.schema";

const ROLE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Super Admin" },
] as const;

const formSchema = z.object({
  email: z.string().email("Invalid email").optional(),
  firstName: z.string().max(225).optional(),
  isActive: z.boolean().optional(),
  lastName: z.string().max(225).optional(),
  name: z.string().min(1, "Name is required").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional()
    .or(z.literal("")),
  phone: z.string().max(255).optional(),
  userRole: z.enum(["user", "admin", "super_admin"]),
});

type FormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  initialData: TUser | null;
  pageTitle: string;
  userId?: string;
}

export default function UserForm({
  initialData,
  pageTitle,
  userId,
}: UserFormProps) {
  const router = useRouter();
  const isEdit = Boolean(userId && initialData);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: initialData?.email ?? "",
      firstName: initialData?.firstName ?? "",
      isActive: initialData?.isActive ?? true,
      lastName: initialData?.lastName ?? "",
      name: initialData?.name ?? "",
      password: "",
      phone: initialData?.phone ?? "",
      userRole: (initialData?.userRole as FormValues["userRole"]) ?? "user",
    },
  });

  async function onSubmit(values: FormValues) {
    if (isEdit && userId) {
      const result = await updateUser(userId, {
        firstName: values.firstName || undefined,
        isActive: values.isActive,
        lastName: values.lastName || undefined,
        name: values.name,
        phone: values.phone || undefined,
        userRole: values.userRole,
      });
      if (AppResponseHandler.isSuccess(result)) {
        toast.success("User updated successfully");
        router.push(`/user/${userId}`);
        router.refresh();
      } else if (AppResponseHandler.isError(result)) {
        toast.error(result.error ?? "Failed to update user");
      }
      return;
    }

    if (!values.email) {
      toast.error("Email is required to create a user");
      return;
    }
    const result = await createUser({
      email: values.email,
      firstName: values.firstName || undefined,
      lastName: values.lastName || undefined,
      name: values.name,
      password:
        values.password && values.password.length >= 8
          ? values.password
          : "TempPassword123!",
      phone: values.phone || undefined,
      userRole: values.userRole,
    });
    if (AppResponseHandler.isSuccess(result)) {
      toast.success("User created successfully");
      router.push("/user");
      router.refresh();
    } else if (AppResponseHandler.isError(result)) {
      toast.error(result.error ?? "Failed to create user");
    }
  }

  return (
    <PageContainer scrollable>
      <div className="w-full space-y-6">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Header: title + actions (same as offers) */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold tracking-tight">{pageTitle}</h1>
              <div className="flex gap-2">
                <Button asChild type="button" variant="outline">
                  <Link href={isEdit && userId ? `/user/${userId}` : "/user"}>
                    Cancel
                  </Link>
                </Button>
                <Button disabled={form.formState.isSubmitting} type="submit">
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEdit ? "Updating..." : "Creating..."}
                    </>
                  ) : isEdit ? (
                    "Update user"
                  ) : (
                    "Create user"
                  )}
                </Button>
              </div>
            </div>

            {/* Profile card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Display name, email and contact details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="user@example.com"
                            type="email"
                            {...field}
                            disabled={isEdit}
                          />
                        </FormControl>
                        {isEdit && (
                          <p className="text-muted-foreground text-xs">
                            Email cannot be changed after creation.
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {!isEdit && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Min 8 characters"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <p className="text-muted-foreground text-xs">
                          Leave empty to use a temporary password.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="max-w-xs">
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Account & role card */}
            <Card>
              <CardHeader>
                <CardTitle>Account & role</CardTitle>
                <CardDescription>
                  Role and active status. Inactive users cannot sign in.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="userRole"
                  render={({ field }) => (
                    <FormItem className="max-w-xs">
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ROLE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isEdit && (
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active</FormLabel>
                          <p className="text-muted-foreground text-sm">
                            Inactive users cannot sign in.
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </PageContainer>
  );
}
