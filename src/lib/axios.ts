import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL, AUTH_ROUTES } from "@/constants";
import { isDemoSession } from "@/lib/demo-auth";
import { useAuthStore } from "@/store/auth-store";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const { accessToken, logout } = useAuthStore.getState();
      if (isDemoSession(accessToken)) {
        return Promise.reject(error);
      }
      const path = window.location.pathname;
      const isAuthPage =
        path === AUTH_ROUTES.LOGIN || path === AUTH_ROUTES.SIGNUP;
      if (!isAuthPage) {
        logout();
        window.location.href = AUTH_ROUTES.LOGIN;
      }
    }
    return Promise.reject(error);
  }
);
