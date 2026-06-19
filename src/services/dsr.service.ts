import { apiClient } from "@/lib/axios";
import type {
  GenerateDSRRequest,
  GenerateDSRResponse,
  ListDSRActivityResponse,
  ListDSRReportsResponse,
  DSRReport,
} from "@/types";

export const dsrService = {
  getActivity: (params: { report_date: string; git_project_ids?: string }) =>
    apiClient.get<ListDSRActivityResponse>("/dsr/activity", { params }),

  generate: (data: GenerateDSRRequest) =>
    apiClient.post<GenerateDSRResponse>("/dsr/generate", data),

  listReports: (params?: {
    from?: string;
    to?: string;
    limit?: number;
    offset?: number;
  }) => apiClient.get<ListDSRReportsResponse>("/dsr", { params }),

  getReport: (id: string) => apiClient.get<DSRReport>(`/dsr/${id}`),
};
