"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { GitBranch, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import {
  useConnectGit,
  useGitIntegrations,
  useGitProjects,
  useSyncCommits,
  useSyncGit,
  useUpdateTrackedProjects,
} from "@/hooks/use-git";
import { connectGitSchema, type ConnectGitFormValues } from "@/lib/validations";
import { getErrorMessage } from "@/lib/utils";

export default function GitPage() {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const { data: integrations, isLoading, error, refetch } = useGitIntegrations();
  const { data: projects, refetch: refetchProjects } = useGitProjects();
  const connectGit = useConnectGit();
  const syncGit = useSyncGit();
  const syncCommits = useSyncCommits();
  const updateTracked = useUpdateTrackedProjects();

  const form = useForm<ConnectGitFormValues>({
    resolver: zodResolver(connectGitSchema),
    defaultValues: {
      provider: "github",
      base_url: "https://github.com",
      access_token: "",
    },
  });

  const onConnect = async (data: ConnectGitFormValues) => {
    try {
      await connectGit.mutateAsync(data);
      toast.success("Git integration connected");
      form.reset({ ...data, access_token: "" });
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const handleSync = async (provider: "github" | "gitlab") => {
    try {
      const result = await syncGit.mutateAsync({ provider });
      toast.success(`Synced ${result.projects_synced} projects`);
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const handleSyncCommits = async () => {
    try {
      const result = await syncCommits.mutateAsync();
      toast.success(`Added ${result.commits_added} commits from ${result.projects_synced} projects`);
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const toggleProject = (id: string) => {
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const saveTracked = async () => {
    try {
      await updateTracked.mutateAsync({ project_ids: selectedProjects });
      toast.success("Tracked projects updated");
      refetchProjects();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Git Integration</h1>
        <p className="text-muted-foreground">Connect GitHub or GitLab and manage repositories</p>
      </div>

      <Tabs defaultValue="connect">
        <TabsList>
          <TabsTrigger value="connect">Connect</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
        </TabsList>

        <TabsContent value="connect" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Connect Git Provider</CardTitle>
              <CardDescription>Add your personal access token to sync repositories</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onConnect)} className="max-w-lg space-y-4">
                <div className="space-y-2">
                  <Label>Provider</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    {...form.register("provider")}
                  >
                    <option value="github">GitHub</option>
                    <option value="gitlab">GitLab</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Base URL</Label>
                  <Input {...form.register("base_url")} placeholder="https://github.com" />
                </div>
                <div className="space-y-2">
                  <Label>Access Token</Label>
                  <Input type="password" {...form.register("access_token")} />
                </div>
                <Button type="submit" disabled={connectGit.isPending}>
                  {connectGit.isPending ? "Connecting..." : "Connect"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-4 space-y-4">
          {integrations?.integrations.map((integration) => (
            <Card key={integration.id}>
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <GitBranch className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-semibold capitalize">{integration.provider}</p>
                    <p className="text-sm text-muted-foreground">@{integration.username}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge>{integration.projects_synced} projects</Badge>
                  <Badge variant="secondary">{integration.tracked_count} tracked</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSync(integration.provider as "github" | "gitlab")}
                    disabled={syncGit.isPending}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Sync repos
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {!integrations?.integrations.length && (
            <EmptyState title="No integrations" description="Connect a Git provider to get started." />
          )}
          {integrations?.integrations.length ? (
            <Button onClick={handleSyncCommits} disabled={syncCommits.isPending}>
              {syncCommits.isPending ? "Syncing..." : "Sync all commits"}
            </Button>
          ) : null}
        </TabsContent>

        <TabsContent value="repositories" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button onClick={saveTracked} disabled={updateTracked.isPending}>
              Save tracked projects
            </Button>
          </div>
          {projects?.projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="flex items-start gap-4 p-4">
                <input
                  type="checkbox"
                  checked={selectedProjects.includes(project.id) || project.is_tracked}
                  onChange={() => toggleProject(project.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{project.name}</p>
                    <Badge variant="outline">{project.provider}</Badge>
                    {project.is_tracked && <Badge variant="success">Tracked</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{project.path_with_namespace}</p>
                  {project.web_url && (
                    <a href={project.web_url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
                      View on {project.provider}
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {!projects?.projects.length && (
            <EmptyState title="No repositories" description="Connect and sync a Git provider first." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
