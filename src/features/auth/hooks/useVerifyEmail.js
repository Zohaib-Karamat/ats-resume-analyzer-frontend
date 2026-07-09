import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";

export function useVerifyEmail() {
  return useMutation({
    mutationFn: authApi.verifyEmail,
  });
}
