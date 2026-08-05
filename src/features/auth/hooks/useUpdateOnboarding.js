import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export const useUpdateOnboarding = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data) => authApi.updateOnboarding(data),
    onSuccess: (updatedUser) => {
      // Keep both the Zustand store and React Query cache in sync
      setUser(updatedUser);
      queryClient.setQueryData(["auth", "me"], updatedUser);
    },
  });
};
