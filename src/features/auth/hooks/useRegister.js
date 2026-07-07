import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";

/**
 * Registers a new user. Note: the backend does not return an auth token on
 * registration (only the created user), so this does not log the user in.
 * Follow up with `useLogin` (same credentials) to establish a session.
 */
export function useRegister() {
  return useMutation({
    mutationFn: authApi.register,
  });
}
