import { apiClient } from "@/lib/axios";
import type {
  ConnectGitRequest,
  ConnectGitResponse,
  ListGitIntegrationsResponse,
  ListGitProjectsResponse,
  SyncCommitsResponse,
  SyncGitRequest,
  SyncGitResponse,
  UpdateTrackedProjectsRequest,
  UpdateTrackedProjectsResponse,
} from "@/types";

export const gitService = {
  connect: (data: ConnectGitRequest) =>
    apiClient.post<ConnectGitResponse>("/integrations/git", data),

  listIntegrations: () =>
    apiClient.get<ListGitIntegrationsResponse>("/integrations/git"),

  sync: (data: SyncGitRequest) =>
    apiClient.post<SyncGitResponse>("/integrations/git/sync", data),

  syncCommits: () =>
    apiClient.post<SyncCommitsResponse>("/integrations/git/commits/sync"),

  listProjects: (params?: { provider?: string; tracked_only?: boolean }) =>
    apiClient.get<ListGitProjectsResponse>("/integrations/git/projects", {
      params,
    }),

  updateTrackedProjects: (data: UpdateTrackedProjectsRequest) =>
    apiClient.patch<UpdateTrackedProjectsResponse>(
      "/integrations/git/projects/tracking",
      data
    ),
};
