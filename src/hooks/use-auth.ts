import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { getDemoLoginResponse, isDemoCredentials } from "@/lib/demo-auth";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/store/auth-store";
import type { LoginRequest, RegisterRequest } from "@/types";

export function useHealthCheck() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: async () => (await authService.health()).data,
    retry: 1,
  });
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      if (isDemoCredentials(data.email, data.password)) {
        return getDemoLoginResponse();
      }
      const res = await authService.login(data);
      return res.data;
    },
    onSuccess: (data) => {
      setAuth(
        { id: data.id, name: data.name, email: data.email },
        data.access_token,
        data.refresh_token
      );
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const res = await authService.register(data);
      return res.data;
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  return () => {
    logout();
    queryClient.clear();
  };
}
