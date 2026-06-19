"use client";

import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import { useDsrReports } from "@/hooks/use-dsr";
import { formatDateTime, getErrorMessage } from "@/lib/utils";

export default function DsrHistoryPage() {
  const { data, isLoading, error, refetch } = useDsrReports({ limit: 50 });

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">DSR History</h1>
          <p className="text-muted-foreground">View all generated daily status reports</p>
        </div>
        <Button asChild>
          <Link href="/dsr/generate">
            <Plus className="h-4 w-4" />
            Generate DSR
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {data?.reports.map((report) => (
          <Link key={report.id} href={`/dsr/${report.id}`}>
            <Card className="transition-colors hover:bg-accent/50">
              <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <FileText className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{report.report_date}</p>
                      {report.git_project_name && (
                        <Badge variant="outline">{report.git_project_name}</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{report.summary}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Model: {report.ai_model} · {formatDateTime(report.created_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {!data?.reports.length && (
          <EmptyState
            title="No DSR reports"
            description="Generate your first daily status report."
            actionLabel="Generate DSR"
            onAction={() => (window.location.href = "/dsr/generate")}
          />
        )}
      </div>
    </div>
  );
}
