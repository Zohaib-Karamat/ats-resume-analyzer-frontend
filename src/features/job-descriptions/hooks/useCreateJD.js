import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jobDescriptionApi } from "../api/jobDescriptionApi";
import toast from "react-hot-toast";

export function useCreateJD() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => jobDescriptionApi.create(data),
    onSuccess: () => {
      toast.success("Job description saved");
      queryClient.invalidateQueries(["job-descriptions"]);
      queryClient.invalidateQueries(["dashboard", "summary"]);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save job description");
    },
  });
}
