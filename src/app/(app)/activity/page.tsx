"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import { useActivitySummary, useSyncActivity } from "@/hooks/use-activity";
import { useDsrActivity as useFullDsrActivity } from "@/hooks/use-dsr";
import { formatDateTime, getErrorMessage, todayISO } from "@/lib/utils";

export default function ActivityPage() {
  const [date, setDate] = useState(todayISO());
  const { data: summary, isLoading, error, refetch } = useActivitySummary(date);
  const { data: fullActivity } = useFullDsrActivity(date);
  const syncActivity = useSyncActivity();

  const onSync = async () => {
    try {
      const result = await syncActivity.mutateAsync();
      toast.success(
        `Synced ${result.local_commits_added} commits and ${result.planning_activities_added} planning events`
      );
      refetch();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activity Tracking</h1>
          <p className="text-muted-foreground">View daily Git and planning activities</p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <Button onClick={onSync} disabled={syncActivity.isPending}>
            <RefreshCw className="h-4 w-4" />
            {syncActivity.isPending ? "Syncing..." : "Sync"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="git">Git</TabsTrigger>
          <TabsTrigger value="jira">Jira</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-4">
          {summary?.local_commits.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{c.repository_name}</Badge>
                  <Badge variant="secondary">{c.branch}</Badge>
                </div>
                <p className="mt-2 font-medium">{c.message}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(c.committed_at)} · {c.author}</p>
              </CardContent>
            </Card>
          ))}
          {summary?.planning_activities.map((a) => (
            <Card key={a.id}>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{a.item_key}</Badge>
                  <Badge variant="outline" className="capitalize">{a.provider}</Badge>
                  <Badge variant="secondary" className="capitalize">{a.activity_type.replace("_", " ")}</Badge>
                </div>
                <p className="mt-2 font-medium">{a.item_title}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(a.occurred_at)}</p>
              </CardContent>
            </Card>
          ))}
          {!summary?.local_commits.length && !summary?.planning_activities.length && (
            <EmptyState title="No activity" description="No activity recorded for this date." />
          )}
        </TabsContent>

        <TabsContent value="git" className="mt-4 space-y-4">
          {fullActivity?.activity.remote_git.flatMap((p) =>
            p.commits.map((c) => (
              <Card key={c.sha}>
                <CardContent className="p-4">
                  <Badge variant="outline">{p.project_name}</Badge>
                  <p className="mt-2 font-medium">{c.message}</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(c.date)} · {c.author}</p>
                </CardContent>
              </Card>
            ))
          )}
          {summary?.local_commits.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-4">
                <Badge variant="secondary">Local · {c.repository_name}</Badge>
                <p className="mt-2 font-medium">{c.message}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(c.committed_at)}</p>
              </CardContent>
            </Card>
          ))}
          {!fullActivity?.activity.remote_git.some((p) => p.commits.length) && !summary?.local_commits.length && (
            <EmptyState title="No Git activity" description="Sync repositories to fetch commits." />
          )}
        </TabsContent>

        <TabsContent value="jira" className="mt-4 space-y-4">
          {summary?.planning_activities
            .filter((a) => a.provider === "jira")
            .map((a) => (
              <Card key={a.id}>
                <CardContent className="p-4">
                  <Badge>{a.item_key}</Badge>
                  <p className="mt-2 font-medium">{a.item_title}</p>
                  <p className="text-xs capitalize text-muted-foreground">
                    {a.activity_type.replace("_", " ")} · {formatDateTime(a.occurred_at)}
                  </p>
                </CardContent>
              </Card>
            ))}
          {!summary?.planning_activities.filter((a) => a.provider === "jira").length && (
            <EmptyState title="No Jira activity" description="Connect Jira and sync activity." />
          )}
        </TabsContent>
      </Tabs>

      {summary?.active_repository && (
        <Card>
          <CardHeader>
            <CardTitle>Active Repository</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{summary.active_repository.repository_name}</p>
            <p className="text-sm text-muted-foreground">{summary.active_repository.repository_path}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
