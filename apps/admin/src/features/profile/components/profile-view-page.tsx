"use client";

import { format } from "date-fns";
import { Calendar, Edit, Loader2, Mail, Phone, Shield } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import PageContainer from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@/lib/zod-resolver";

const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  confirmPassword: z.string().min(8, "Please confirm your password"),
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;
type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfxileViewPage() {
  const { isLoading: authLoading, resetPassword, updateUser, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      name: user?.name || "",
      phone: user?.phone || "",
    },
    resolver: zodResolver(profileSchema),
    values: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      name: user?.name || "",
      phone: user?.phone || "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    defaultValues: {
      confirmPassword: "",
      currentPassword: "",
      newPassword: "",
    },
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormValues) => {
    if (!user) {
      toast.error("User not found");
      return;
    }

    setIsSubmitting(true);
    try {
      // Update user profile
      await updateUser({
        firstName: data.firstName,
        lastName: data.lastName,
        name: data.name,
        phone: data.phone,
      });

      setIsEditing(false);
      profileForm.reset({
        firstName: data.firstName,
        lastName: data.lastName,
        name: data.name,
        phone: data.phone,
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsChangingPassword(true);
    try {
      await resetPassword(data.newPassword);
      passwordForm.reset();
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error?.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (authLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer>
        <Card>
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>Please sign in to view your profile.</CardDescription>
          </CardHeader>
        </Card>
      </PageContainer>
    );
  }

  const roleLabel = user.userRole?.replace("_", " ").toUpperCase() || "USER";

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <Heading description="View and manage your account information" title="My Profile" />
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
        <Separator />

        {!isEditing ? (
          /* View Mode */
          <div className="grid gap-6 md:grid-cols-3">
            {/* Main Profile Card */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Your personal account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Name Section */}
                  <div className="flex flex-col items-center gap-2 pb-6 border-b">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold">{user.name}</h2>
                      {user.firstName || user.lastName ? (
                        <p className="text-muted-foreground">
                          {[user.firstName, user.lastName].filter(Boolean).join(" ")}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </label>
                      <p className="text-lg font-semibold">{user.email}</p>
                      {!user.emailVerified && (
                        <p className="text-xs text-amber-600 mt-1">Email not verified</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </label>
                      <p className="text-lg font-semibold">{user.phone || "—"}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4" />
                        Role
                      </label>
                      <Badge className="mt-1" variant="secondary">
                        {roleLabel}
                      </Badge>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4" />
                        Member Since
                      </label>
                      <p className="text-lg font-semibold">
                        {format(new Date(user.createdAt), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-2">
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">User ID</label>
                    <p className="mt-1 text-sm font-mono break-all">{user.id}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <div className="grid gap-6 md:grid-cols-2">
            {/* Profile Information Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      profileForm.reset();
                    }}
                    size="sm"
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form
                    className="space-y-6"
                    onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  >

                    {/* Name Fields */}
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input disabled={isSubmitting} placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={profileForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input
                                disabled={isSubmitting}
                                placeholder="John"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input
                                disabled={isSubmitting}
                                placeholder="Doe"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Email (Read-only) */}
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input disabled value={user.email} />
                      </FormControl>
                      <FormDescription>
                        Email cannot be changed. Contact support if you need to update it.
                      </FormDescription>
                    </FormItem>

                    {/* Phone */}
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isSubmitting}
                              placeholder="+1 234 567 8900"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Role (Read-only) */}
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          value={roleLabel}
                        />
                      </FormControl>
                      <FormDescription>
                        Your role is managed by administrators.
                      </FormDescription>
                    </FormItem>

                    <div className="flex gap-2">
                      <Button className="flex-1" disabled={isSubmitting} type="submit">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditing(false);
                          profileForm.reset();
                        }}
                        type="button"
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Password Change Card */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form
                    className="space-y-6"
                    onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  >
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isChangingPassword}
                              placeholder="Enter current password"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isChangingPassword}
                              placeholder="Enter new password"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Password must be at least 8 characters long.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isChangingPassword}
                              placeholder="Confirm new password"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button className="w-full" disabled={isChangingPassword} type="submit" variant="outline">
                      {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Change Password
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
