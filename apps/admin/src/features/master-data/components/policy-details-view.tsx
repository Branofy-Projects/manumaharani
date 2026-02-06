"use client";

import { CheckCircle, Edit, Tag, XCircle } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { TPolicy } from "@repo/db";

interface PolicyDetailsViewProps {
  policy: TPolicy;
}

export default function PolicyDetailsView({ policy }: PolicyDetailsViewProps) {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{policy.label}</h1>
            <Badge variant={policy.kind === "include" ? "default" : "destructive"}>
              {policy.kind === "include" ? "Include" : "Exclude"}
            </Badge>
          </div>
        </div>
        <Button asChild>
          <Link href={`/policies/${policy.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Policy
          </Link>
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Policy Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  {policy.kind === "include" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  Type
                </label>
                <p className="mt-1 text-lg font-semibold capitalize">
                  {policy.kind}
                </p>
              </div>
              {policy.description && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                      {policy.description}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Policy Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  ID
                </label>
                <p className="mt-1 text-lg font-semibold">{policy.id}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


