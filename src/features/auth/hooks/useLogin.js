import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

/**
 * Logs a user in and persists the returned user/token in the auth store.
 */
export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
    },
  });
}
