import {
  DEMO_ACCESS_TOKEN,
  DEMO_LOGIN,
  DEMO_REFRESH_TOKEN,
  DEMO_USER,
} from "@/constants";
import type { LoginResponse } from "@/types";

export function isDemoCredentials(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === DEMO_LOGIN.email &&
    password === DEMO_LOGIN.password
  );
}

export function isDemoSession(accessToken: string | null | undefined): boolean {
  return accessToken === DEMO_ACCESS_TOKEN;
}

export function getDemoLoginResponse(): LoginResponse {
  return {
    id: DEMO_USER.id,
    name: DEMO_USER.name,
    email: DEMO_USER.email,
    access_token: DEMO_ACCESS_TOKEN,
    refresh_token: DEMO_REFRESH_TOKEN,
  };
}
