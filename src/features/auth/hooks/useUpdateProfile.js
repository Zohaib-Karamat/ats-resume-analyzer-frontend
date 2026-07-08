import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

/**
 * Updates the current user's editable profile fields.
 * PATCH /auth/me { name?, email? }
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: authApi.updateMe,
    onSuccess: (data) => {
      const updatedUser = data.user ?? data;
      setUser(updatedUser);
      queryClient.setQueryData(["auth", "me"], data);
    },
  });
}
