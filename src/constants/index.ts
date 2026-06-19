export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export const AUTH_ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/signup",
} as const;

export const DEMO_LOGIN = {
  email: "demo@dsr.com",
  password: "demo123",
} as const;

export const DEMO_ACCESS_TOKEN = "demo-access-token";
export const DEMO_REFRESH_TOKEN = "demo-refresh-token";

export const DEMO_USER = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Demo User",
  email: DEMO_LOGIN.email,
} as const;

export const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
  "/dsr",
  "/git",
  "/jira",
  "/activity",
  "/settings",
] as const;

export const TOKEN_KEYS = {
  ACCESS: "dsr_access_token",
  REFRESH: "dsr_refresh_token",
  USER: "dsr_user",
} as const;

export const GIT_PROVIDERS = ["github", "gitlab"] as const;
export const PLANNING_PROVIDERS = ["jira", "trello"] as const;

export const ACTIVITY_TYPES = {
  ASSIGNED: "assigned",
  STATUS_CHANGE: "status_change",
  COMMENT_ADDED: "comment_added",
  COMPLETED: "completed",
} as const;

export const NAV_ITEMS = [
  { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { title: "DSR", href: "/dsr", icon: "FileText" },
  { title: "Git", href: "/git", icon: "GitBranch" },
  { title: "Jira", href: "/jira", icon: "Kanban" },
  { title: "Activity", href: "/activity", icon: "Activity" },
  { title: "Settings", href: "/settings", icon: "Settings" },
] as const;
