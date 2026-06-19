import { apiClient } from "@/lib/axios";
import type {
  ActivitySummaryResponse,
  ConnectPlanningRequest,
  ListLocalGitReposResponse,
  ListPlanningIntegrationsResponse,
  ListPlanningProvidersResponse,
  PlanningIntegration,
  SyncActivityResponse,
  SetActiveRepositoryRequest,
  ActiveRepo,
  RegisterLocalGitRepoRequest,
  LocalGitRepository,
  UpdateTrackedLocalReposRequest,
} from "@/types";

export const activityService = {
  getSummary: (report_date: string) =>
    apiClient.get<ActivitySummaryResponse>("/activity", {
      params: { report_date },
    }),

  sync: () => apiClient.post<SyncActivityResponse>("/activity/sync"),

  setActiveRepository: (data: SetActiveRepositoryRequest) =>
    apiClient.put<ActiveRepo>("/activity/active-repository", data),

  getActiveRepository: () =>
    apiClient.get<ActiveRepo>("/activity/active-repository"),

  registerLocalRepository: (data: RegisterLocalGitRepoRequest) =>
    apiClient.post<LocalGitRepository>("/activity/local-git/repositories", data),

  listLocalRepositories: (params?: { tracked_only?: boolean }) =>
    apiClient.get<ListLocalGitReposResponse>(
      "/activity/local-git/repositories",
      { params }
    ),

  updateTrackedLocalRepositories: (data: UpdateTrackedLocalReposRequest) =>
    apiClient.patch<ListLocalGitReposResponse>(
      "/activity/local-git/repositories/tracking",
      data
    ),

  deleteLocalRepository: (id: string) =>
    apiClient.delete(`/activity/local-git/repositories/${id}`),

  listPlanningProviders: () =>
    apiClient.get<ListPlanningProvidersResponse>(
      "/activity/planning/providers"
    ),

  connectPlanning: (data: ConnectPlanningRequest) =>
    apiClient.post<PlanningIntegration>("/activity/planning/connect", data),

  listPlanningIntegrations: () =>
    apiClient.get<ListPlanningIntegrationsResponse>("/activity/planning"),

  getPlanningIntegration: (provider: string) =>
    apiClient.get<PlanningIntegration>("/activity/planning/integration", {
      params: { provider },
    }),

  disconnectPlanning: (provider: string) =>
    apiClient.delete("/activity/planning", { params: { provider } }),
};
