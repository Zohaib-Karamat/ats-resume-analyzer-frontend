import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";

export function useResendVerificationOtp() {
  return useMutation({
    mutationFn: authApi.resendVerificationOtp,
  });
}
