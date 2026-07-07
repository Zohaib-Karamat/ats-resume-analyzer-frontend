import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";

/**
 * Changes the current user's password.
 * POST /auth/change-password { currentPassword, newPassword, confirmNewPassword }
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: authApi.changePassword,
  });
}
