"use client";

import Link from "next/link";
import {
  Edit,
  Mail,
  User,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { TUser } from "@repo/db/schema/auth.schema";

const rolesMap: Record<string, string> = {
  admin: "Admin",
  super_admin: "Super Admin",
  user: "User",
};

const rolesVariantMap = {
  admin: "secondary",
  super_admin: "destructive",
  user: "outline",
} as const;

interface UserDetailsViewProps {
  user: TUser;
  canEdit?: boolean;
}

export default function UserDetailsView({ user, canEdit = true }: UserDetailsViewProps) {
  const roleValue = user.userRole;
  const roleLabel = rolesMap[roleValue] ?? roleValue;
  const roleVariant = rolesVariantMap[roleValue as keyof typeof rolesVariantMap] ?? "outline";

  return (
    <div className="w-full space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.name ?? "Unnamed User"}
            </h1>
            <Badge variant={roleVariant} className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              {roleLabel}
            </Badge>
            {user.isActive !== undefined && (
              <Badge
                variant={user.isActive ? "default" : "secondary"}
                className="flex items-center gap-1"
              >
                {user.isActive ? (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    Active
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3" />
                    Inactive
                  </>
                )}
              </Badge>
            )}
          </div>
          {user.email && (
            <p className="text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {user.email}
            </p>
          )}
        </div>
        {canEdit && (
          <Button asChild>
            <Link href={`/user/${user.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit User
            </Link>
          </Button>
        )}
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Display name
                </label>
                <p className="mt-1 text-lg font-semibold">{user.name ?? "—"}</p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <p className="mt-1 font-mono text-sm">{user.email ?? "—"}</p>
              </div>
              {(user.firstName || user.lastName) && (
                <>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        First name
                      </label>
                      <p className="mt-1">{user.firstName ?? "—"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Last name
                      </label>
                      <p className="mt-1">{user.lastName ?? "—"}</p>
                    </div>
                  </div>
                </>
              )}
              {user.phone && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </label>
                    <p className="mt-1">{user.phone}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Role
                </label>
                <p className="mt-1">
                  <Badge variant={roleVariant}>{roleLabel}</Badge>
                </p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Created
                </label>
                <p className="mt-1 text-sm text-muted-foreground">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </p>
              </div>
              {user.updatedAt && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Last updated
                    </label>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Date(user.updatedAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
