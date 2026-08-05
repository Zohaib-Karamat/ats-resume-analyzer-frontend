import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

/**
 * Logs the current user out. The local session is always cleared, even if
 * the backend call fails (e.g. the token already expired).
 */
export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      logout();
      queryClient.clear();
    },
    onSuccess: () => {
      toast.success("Successfully Logged out!");
    }
  });
}
