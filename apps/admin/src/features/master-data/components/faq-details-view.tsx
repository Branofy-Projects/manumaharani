"use client";

import Link from "next/link";
import { Edit, Calendar, HelpCircle, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { TFaq } from "@repo/db";

interface FaqDetailsViewProps {
  faq: TFaq;
}

export default function FaqDetailsView({ faq }: FaqDetailsViewProps) {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-8 w-8 text-muted-foreground" />
            <h1 className="text-3xl font-bold">{faq.question}</h1>
          </div>
        </div>
        <Button asChild>
          <Link href={`/faqs/${faq.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit FAQ
          </Link>
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Answer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {faq.answer}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>FAQ Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  ID
                </label>
                <p className="mt-1 text-lg font-semibold">{faq.id}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}



