"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Kanban, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import {
  useActivitySummary,
  useConnectPlanning,
  useDisconnectPlanning,
  usePlanningIntegrations,
  useSyncActivity,
} from "@/hooks/use-activity";
import { connectJiraSchema, type ConnectJiraFormValues } from "@/lib/validations";
import { formatDateTime, getErrorMessage, todayISO } from "@/lib/utils";

export default function JiraPage() {
  const today = todayISO();
  const { data: integrations, isLoading, error, refetch } = usePlanningIntegrations();
  const { data: activity } = useActivitySummary(today);
  const connectPlanning = useConnectPlanning();
  const disconnectPlanning = useDisconnectPlanning();
  const syncActivity = useSyncActivity();

  const jiraIntegration = integrations?.integrations.find((i) => i.provider === "jira");
  const jiraActivities = activity?.planning_activities.filter((a) => a.provider === "jira") ?? [];
  const assigned = jiraActivities.filter((a) => a.activity_type === "assigned");
  const completed = jiraActivities.filter((a) => a.activity_type === "completed");

  const form = useForm<ConnectJiraFormValues>({
    resolver: zodResolver(connectJiraSchema),
    defaultValues: {
      provider: "jira",
      base_url: "",
      email: "",
      api_token: "",
    },
  });

  const onConnect = async (data: ConnectJiraFormValues) => {
    try {
      await connectPlanning.mutateAsync(data);
      toast.success("Jira connected successfully");
      form.reset({ ...data, api_token: "" });
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const onDisconnect = async () => {
    try {
      await disconnectPlanning.mutateAsync("jira");
      toast.success("Jira disconnected");
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const onSync = async () => {
    try {
      const result = await syncActivity.mutateAsync();
      toast.success(`Added ${result.planning_activities_added} planning activities`);
      refetch();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Jira Integration</h1>
          <p className="text-muted-foreground">Connect Jira and view ticket activity</p>
        </div>
        {jiraIntegration && (
          <Button onClick={onSync} disabled={syncActivity.isPending}>
            {syncActivity.isPending ? "Syncing..." : "Sync activity"}
          </Button>
        )}
      </div>

      <Tabs defaultValue="connect">
        <TabsList>
          <TabsTrigger value="connect">Connect</TabsTrigger>
          <TabsTrigger value="projects">Integration</TabsTrigger>
          <TabsTrigger value="assigned">Assigned</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="connect" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Connect Jira</CardTitle>
              <CardDescription>Use your Atlassian email and API token</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onConnect)} className="max-w-lg space-y-4">
                <div className="space-y-2">
                  <Label>Jira URL</Label>
                  <Input {...form.register("base_url")} placeholder="https://your-domain.atlassian.net" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" {...form.register("email")} />
                </div>
                <div className="space-y-2">
                  <Label>API Token</Label>
                  <Input type="password" {...form.register("api_token")} />
                </div>
                <Button type="submit" disabled={connectPlanning.isPending}>
                  {connectPlanning.isPending ? "Connecting..." : "Connect Jira"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="mt-4">
          {jiraIntegration ? (
            <Card>
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Kanban className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-semibold">{jiraIntegration.display_name}</p>
                    <p className="text-sm text-muted-foreground">{jiraIntegration.email}</p>
                    {jiraIntegration.last_sync_at && (
                      <p className="text-xs text-muted-foreground">
                        Last sync: {formatDateTime(jiraIntegration.last_sync_at)}
                      </p>
                    )}
                  </div>
                </div>
                <Button variant="destructive" size="sm" onClick={onDisconnect}>
                  <Trash2 className="h-4 w-4" />
                  Disconnect
                </Button>
              </CardContent>
            </Card>
          ) : (
            <EmptyState title="Jira not connected" description="Connect your Jira account to sync tickets." />
          )}
        </TabsContent>

        <TabsContent value="assigned" className="mt-4 space-y-3">
          {assigned.map((ticket) => (
            <Card key={`${ticket.item_key}-${ticket.occurred_at}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Badge>{ticket.item_key}</Badge>
                  <Badge variant="warning">Assigned</Badge>
                </div>
                <p className="mt-2 font-medium">{ticket.item_title}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(ticket.occurred_at)}</p>
              </CardContent>
            </Card>
          ))}
          {!assigned.length && <EmptyState title="No assigned tickets" description="Sync activity to fetch Jira updates." />}
        </TabsContent>

        <TabsContent value="completed" className="mt-4 space-y-3">
          {completed.map((ticket) => (
            <Card key={`${ticket.item_key}-${ticket.occurred_at}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Badge>{ticket.item_key}</Badge>
                  <Badge variant="success">Completed</Badge>
                </div>
                <p className="mt-2 font-medium">{ticket.item_title}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(ticket.occurred_at)}</p>
              </CardContent>
            </Card>
          ))}
          {!completed.length && <EmptyState title="No completed tickets" description="Completed tickets will appear after sync." />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
