"use client";

import Link from "next/link";
import {
  FileText,
  GitCommit,
  GitBranch,
  Kanban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import { useDsrActivity, useDsrReports } from "@/hooks/use-dsr";
import { useGitIntegrations } from "@/hooks/use-git";
import { usePlanningIntegrations, useActivitySummary } from "@/hooks/use-activity";
import { formatDateTime, getErrorMessage, todayISO } from "@/lib/utils";

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const today = todayISO();
  const { data: activity, isLoading: activityLoading, error: activityError, refetch } = useDsrActivity(today);
  const { data: reports } = useDsrReports({ limit: 5 });
  const { data: gitIntegrations } = useGitIntegrations();
  const { data: planningIntegrations } = usePlanningIntegrations();
  const { data: activitySummary } = useActivitySummary(today);

  if (activityLoading) return <LoadingState rows={4} />;
  if (activityError) return <ErrorState message={getErrorMessage(activityError)} onRetry={() => refetch()} />;

  const todayReport = reports?.reports.find((r) => r.report_date === today);
  const jiraActivities = activitySummary?.planning_activities.filter((a) => a.provider === "jira") ?? [];
  const assignedTickets = jiraActivities.filter((a) => a.activity_type === "assigned");
  const completedTickets = jiraActivities.filter((a) => a.activity_type === "completed");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your daily status and integrations</p>
        </div>
        <Button asChild>
          <Link href="/dsr/generate">
            <FileText className="h-4 w-4" />
            Generate DSR
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Remote Commits"
          value={activity?.total_remote_commits ?? 0}
          description="Today"
          icon={GitCommit}
        />
        <StatCard
          title="Local Commits"
          value={activity?.total_local_commits ?? 0}
          description="Today"
          icon={GitBranch}
        />
        <StatCard
          title="Planning Events"
          value={activity?.total_planning_events ?? 0}
          description="Today"
          icon={Kanban}
        />
        <StatCard
          title="Git Integrations"
          value={gitIntegrations?.integrations.length ?? 0}
          description="Connected"
          icon={GitBranch}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s DSR Status</CardTitle>
            <CardDescription>{today}</CardDescription>
          </CardHeader>
          <CardContent>
            {todayReport ? (
              <div className="space-y-2">
                <Badge variant="success">Generated</Badge>
                <p className="text-sm text-muted-foreground line-clamp-2">{todayReport.summary}</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dsr/${todayReport.id}`}>View report</Link>
                </Button>
              </div>
            ) : (
              <EmptyState
                title="No DSR for today"
                description="Generate your daily status report to get started."
                actionLabel="Generate DSR"
                onAction={() => (window.location.href = "/dsr/generate")}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connected Integrations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {gitIntegrations?.integrations.map((i) => (
              <div key={i.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium capitalize">{i.provider}</p>
                  <p className="text-sm text-muted-foreground">@{i.username}</p>
                </div>
                <Badge variant="secondary">{i.tracked_count} tracked</Badge>
              </div>
            ))}
            {planningIntegrations?.integrations.map((i) => (
              <div key={i.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium capitalize">{i.provider}</p>
                  <p className="text-sm text-muted-foreground">{i.display_name}</p>
                </div>
                <Badge variant="secondary">Connected</Badge>
              </div>
            ))}
            {!gitIntegrations?.integrations.length && !planningIntegrations?.integrations.length && (
              <EmptyState title="No integrations" description="Connect Git or Jira to sync activity." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Commits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activity?.activity.remote_git.flatMap((p) =>
              p.commits.slice(0, 3).map((c) => (
                <div key={c.sha} className="rounded-lg border p-3">
                  <p className="text-sm font-medium line-clamp-1">{c.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.project_name} · {c.author}
                  </p>
                </div>
              ))
            )}
            {!activity?.activity.remote_git.some((p) => p.commits.length) && (
              <EmptyState title="No commits today" description="Sync repositories to fetch commits." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jira Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3 text-center">
                <p className="text-2xl font-bold">{assignedTickets.length}</p>
                <p className="text-xs text-muted-foreground">Assigned</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <p className="text-2xl font-bold">{completedTickets.length}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
            {jiraActivities.slice(0, 3).map((a) => (
              <div key={`${a.item_key}-${a.occurred_at}`} className="rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{a.item_key}</Badge>
                  <span className="text-xs capitalize text-muted-foreground">{a.activity_type.replace("_", " ")}</span>
                </div>
                <p className="mt-1 text-sm line-clamp-1">{a.item_title}</p>
              </div>
            ))}
            {!jiraActivities.length && (
              <EmptyState title="No Jira activity" description="Connect Jira to see ticket updates." />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent DSR Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {reports?.reports.map((report) => (
            <Link
              key={report.id}
              href={`/dsr/${report.id}`}
              className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent"
            >
              <div>
                <p className="font-medium">{report.report_date}</p>
                <p className="text-sm text-muted-foreground line-clamp-1">{report.summary}</p>
              </div>
              <span className="text-xs text-muted-foreground">{formatDateTime(report.created_at)}</span>
            </Link>
          ))}
          {!reports?.reports.length && (
            <EmptyState title="No reports yet" description="Your generated DSR reports will appear here." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
