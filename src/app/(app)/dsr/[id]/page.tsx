"use client";

import Link from "next/link";
import { use } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { useDsrReport } from "@/hooks/use-dsr";
import { formatDateTime, getErrorMessage } from "@/lib/utils";

export default function DsrDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: report, isLoading, error, refetch } = useDsrReport(id);

  if (isLoading) return <LoadingState />;
  if (error || !report) {
    return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dsr">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">DSR — {report.report_date}</h1>
          <p className="text-sm text-muted-foreground">
            Generated {formatDateTime(report.created_at)} · {report.ai_model}
          </p>
        </div>
      </div>

      {report.git_project_name && (
        <Badge variant="outline">{report.git_project_name}</Badge>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Yesterday&apos;s Work</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{report.yesterday_work}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{report.today_plan}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Blockers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{report.blockers || "None"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{report.summary}</p>
        </CardContent>
      </Card>
    </div>
  );
}
