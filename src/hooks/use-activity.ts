import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { activityService } from "@/services/activity.service";
import { queryKeys } from "@/lib/query-keys";
import type { ConnectPlanningRequest, SetActiveRepositoryRequest } from "@/types";

export function useActivitySummary(reportDate: string) {
  return useQuery({
    queryKey: queryKeys.activity.summary(reportDate),
    queryFn: async () => (await activityService.getSummary(reportDate)).data,
    enabled: !!reportDate,
  });
}

export function useSyncActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => (await activityService.sync()).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activity"] });
      qc.invalidateQueries({ queryKey: ["dsr"] });
    },
  });
}

export function usePlanningIntegrations() {
  return useQuery({
    queryKey: queryKeys.activity.planningIntegrations,
    queryFn: async () => (await activityService.listPlanningIntegrations()).data,
  });
}

export function usePlanningIntegration(provider: string) {
  return useQuery({
    queryKey: queryKeys.activity.planningIntegration(provider),
    queryFn: async () =>
      (await activityService.getPlanningIntegration(provider)).data,
    enabled: !!provider,
  });
}

export function usePlanningProviders() {
  return useQuery({
    queryKey: queryKeys.activity.planningProviders,
    queryFn: async () => (await activityService.listPlanningProviders()).data,
  });
}

export function useConnectPlanning() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: ConnectPlanningRequest) =>
      (await activityService.connectPlanning(data)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.activity.planningIntegrations });
    },
  });
}

export function useDisconnectPlanning() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (provider: string) => {
      await activityService.disconnectPlanning(provider);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.activity.planningIntegrations });
    },
  });
}

export function useLocalRepositories(trackedOnly?: boolean) {
  return useQuery({
    queryKey: queryKeys.activity.localRepos(trackedOnly),
    queryFn: async () =>
      (await activityService.listLocalRepositories({ tracked_only: trackedOnly }))
        .data,
  });
}

export function useActiveRepository() {
  return useQuery({
    queryKey: queryKeys.activity.activeRepo,
    queryFn: async () => (await activityService.getActiveRepository()).data,
    retry: false,
  });
}

export function useSetActiveRepository() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: SetActiveRepositoryRequest) =>
      (await activityService.setActiveRepository(data)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.activity.activeRepo });
    },
  });
}
