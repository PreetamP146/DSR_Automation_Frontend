import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const connectGitSchema = z.object({
  provider: z.enum(["github", "gitlab"]),
  base_url: z.string().url("Enter a valid base URL"),
  access_token: z.string().min(1, "Access token is required"),
});

export const connectJiraSchema = z.object({
  provider: z.literal("jira"),
  base_url: z.string().url("Enter a valid Jira URL"),
  email: z.string().email("Enter a valid email"),
  api_token: z.string().min(1, "API token is required"),
});

export const generateDsrSchema = z.object({
  report_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
  git_project_ids: z.array(z.string()).optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ConnectGitFormValues = z.infer<typeof connectGitSchema>;
export type ConnectJiraFormValues = z.infer<typeof connectJiraSchema>;
export type GenerateDsrFormValues = z.infer<typeof generateDsrSchema>;
