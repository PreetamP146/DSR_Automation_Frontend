export const queryKeys = {
  health: ["health"] as const,
  auth: {
    me: ["auth", "me"] as const,
  },
  git: {
    integrations: ["git", "integrations"] as const,
    projects: (params?: { provider?: string; tracked_only?: boolean }) =>
      ["git", "projects", params] as const,
  },
  dsr: {
    activity: (date: string, projectIds?: string) =>
      ["dsr", "activity", date, projectIds] as const,
    reports: (params?: object) => ["dsr", "reports", params] as const,
    report: (id: string) => ["dsr", "report", id] as const,
  },
  activity: {
    summary: (date: string) => ["activity", "summary", date] as const,
    localRepos: (trackedOnly?: boolean) =>
      ["activity", "local-repos", trackedOnly] as const,
    activeRepo: ["activity", "active-repo"] as const,
    planningProviders: ["activity", "planning-providers"] as const,
    planningIntegrations: ["activity", "planning-integrations"] as const,
    planningIntegration: (provider: string) =>
      ["activity", "planning-integration", provider] as const,
  },
};
