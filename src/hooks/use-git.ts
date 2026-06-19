import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { gitService } from "@/services/git.service";
import { queryKeys } from "@/lib/query-keys";
import type {
  ConnectGitRequest,
  SyncGitRequest,
  UpdateTrackedProjectsRequest,
} from "@/types";

export function useGitIntegrations() {
  return useQuery({
    queryKey: queryKeys.git.integrations,
    queryFn: async () => (await gitService.listIntegrations()).data,
  });
}

export function useGitProjects(params?: {
  provider?: string;
  tracked_only?: boolean;
}) {
  return useQuery({
    queryKey: queryKeys.git.projects(params),
    queryFn: async () => (await gitService.listProjects(params)).data,
  });
}

export function useConnectGit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: ConnectGitRequest) =>
      (await gitService.connect(data)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.git.integrations });
      qc.invalidateQueries({ queryKey: ["git", "projects"] });
    },
  });
}

export function useSyncGit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: SyncGitRequest) =>
      (await gitService.sync(data)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.git.integrations });
      qc.invalidateQueries({ queryKey: ["git", "projects"] });
    },
  });
}

export function useSyncCommits() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => (await gitService.syncCommits()).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dsr"] });
      qc.invalidateQueries({ queryKey: ["activity"] });
    },
  });
}

export function useUpdateTrackedProjects() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateTrackedProjectsRequest) =>
      (await gitService.updateTrackedProjects(data)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["git", "projects"] });
      qc.invalidateQueries({ queryKey: queryKeys.git.integrations });
    },
  });
}
