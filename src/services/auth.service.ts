import { apiClient } from "@/lib/axios";
import type {
  HealthResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types";

export const authService = {
  health: () => apiClient.get<HealthResponse>("/health"),

  register: (data: RegisterRequest) =>
    apiClient.post<RegisterResponse>("/auth/register", data),

  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>("/auth/login", data),
};
