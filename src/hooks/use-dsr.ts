import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dsrService } from "@/services/dsr.service";
import { queryKeys } from "@/lib/query-keys";
import type { GenerateDSRRequest } from "@/types";

export function useDsrActivity(reportDate: string, gitProjectIds?: string) {
  return useQuery({
    queryKey: queryKeys.dsr.activity(reportDate, gitProjectIds),
    queryFn: async () =>
      (
        await dsrService.getActivity({
          report_date: reportDate,
          git_project_ids: gitProjectIds,
        })
      ).data,
    enabled: !!reportDate,
  });
}

export function useDsrReports(params?: {
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: queryKeys.dsr.reports(params),
    queryFn: async () => (await dsrService.listReports(params)).data,
  });
}

export function useDsrReport(id: string) {
  return useQuery({
    queryKey: queryKeys.dsr.report(id),
    queryFn: async () => (await dsrService.getReport(id)).data,
    enabled: !!id,
  });
}

export function useGenerateDsr() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: GenerateDSRRequest) =>
      (await dsrService.generate(data)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dsr"] });
    },
  });
}
