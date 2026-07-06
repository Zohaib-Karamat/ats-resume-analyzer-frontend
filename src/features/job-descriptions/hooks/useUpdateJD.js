import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jobDescriptionApi } from "../api/jobDescriptionApi";
import toast from "react-hot-toast";

export function useUpdateJD() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params) => jobDescriptionApi.update(params),
    onSuccess: () => {
      toast.success("Job description updated");
      queryClient.invalidateQueries(["job-descriptions"]);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update job description");
    },
  });
}
