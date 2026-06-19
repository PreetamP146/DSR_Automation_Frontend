// Auth
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  name: string;
  email: string;
  access_token: string;
  refresh_token: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

// Git
export interface ConnectGitRequest {
  provider: "github" | "gitlab";
  base_url: string;
  access_token: string;
}

export interface SyncGitRequest {
  provider: "github" | "gitlab";
}

export interface UpdateTrackedProjectsRequest {
  project_ids: string[];
}

export interface GitProject {
  id: string;
  git_integration_id: string;
  provider: string;
  git_project_id: string;
  name: string;
  path: string;
  path_with_namespace: string;
  web_url: string;
  description: string;
  default_branch: string;
  is_tracked: boolean;
}

export interface GitIntegration {
  id: string;
  provider: string;
  base_url: string;
  username: string;
  projects_synced: number;
  tracked_count: number;
}

export interface ConnectGitResponse {
  id: string;
  provider: string;
  base_url: string;
  username: string;
  projects_synced: number;
  projects: GitProject[];
}

export type SyncGitResponse = ConnectGitResponse;

export interface ListGitProjectsResponse {
  projects: GitProject[];
  total: number;
}

export interface ListGitIntegrationsResponse {
  integrations: GitIntegration[];
}

export interface UpdateTrackedProjectsResponse {
  tracked_count: number;
  projects: GitProject[];
}

export interface SyncCommitsResponse {
  projects_synced: number;
  commits_added: number;
}

// Activity
export interface RemoteCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  url?: string;
}

export interface RemoteProject {
  project_id: string;
  project_name: string;
  path_with_namespace: string;
  provider: string;
  commits: RemoteCommit[];
}

export interface LocalCommit {
  sha: string;
  message: string;
  branch: string;
  repository_name: string;
  author: string;
  date: string;
}

export interface PlanningItem {
  provider: string;
  activity_type: string;
  item_key: string;
  item_title: string;
  status?: string;
  previous_status?: string;
  comment?: string;
  occurred_at: string;
}

export interface ActiveRepo {
  repository_name: string;
  repository_path: string;
  source: string;
  updated_at: string;
}

export interface ActivitySummary {
  report_date: string;
  remote_git: RemoteProject[];
  local_commits: LocalCommit[];
  planning_activities: PlanningItem[];
  active_repository?: ActiveRepo;
}

export interface LocalGitRepository {
  id: string;
  name: string;
  path: string;
  is_tracked: boolean;
  last_scanned_at?: string;
}

export interface LocalGitCommit {
  id: string;
  sha: string;
  message: string;
  branch: string;
  repository_name: string;
  author: string;
  committed_at: string;
}

export interface PlanningIntegration {
  id: string;
  provider: string;
  base_url?: string;
  email?: string;
  display_name: string;
  last_sync_at?: string;
}

export interface PlanningActivity {
  id: string;
  provider: string;
  activity_type: string;
  item_key: string;
  item_title: string;
  status?: string;
  previous_status?: string;
  comment?: string;
  occurred_at: string;
}

export interface ConnectPlanningRequest {
  provider: "jira" | "trello";
  base_url?: string;
  email?: string;
  api_token?: string;
  api_key?: string;
}

export interface SyncActivityResponse {
  local_repos_synced: number;
  local_commits_added: number;
  planning_integrations_synced: number;
  planning_activities_added: number;
}

export interface ActivitySummaryResponse {
  report_date: string;
  local_commits: LocalGitCommit[];
  planning_activities: PlanningActivity[];
  active_repository?: ActiveRepo;
}

export interface ListPlanningProvidersResponse {
  providers: string[];
}

export interface ListPlanningIntegrationsResponse {
  integrations: PlanningIntegration[];
  total: number;
}

export interface RegisterLocalGitRepoRequest {
  name?: string;
  path: string;
}

export interface UpdateTrackedLocalReposRequest {
  repository_ids: string[];
}

export interface ListLocalGitReposResponse {
  repositories: LocalGitRepository[];
  total: number;
}

export interface SetActiveRepositoryRequest {
  repository_name: string;
  repository_path: string;
  source?: string;
}

// DSR
export interface GenerateDSRRequest {
  report_date: string;
  git_project_ids?: string[];
}

export interface DSRReport {
  id: string;
  report_date: string;
  git_project_id?: string;
  git_project_name?: string;
  yesterday_work: string;
  today_plan: string;
  blockers: string;
  summary: string;
  ai_model: string;
  prompt_version: string;
  created_at: string;
  updated_at: string;
}

export interface GenerateDSRResponse {
  report: DSRReport;
  activity: ActivitySummary;
}

export interface ListDSRActivityResponse {
  report_date: string;
  activity: ActivitySummary;
  total_remote_commits: number;
  total_local_commits: number;
  total_planning_events: number;
}

export interface ListDSRReportsResponse {
  reports: DSRReport[];
  total: number;
}

export interface ApiError {
  error: string;
}

export interface HealthResponse {
  status: string;
}
