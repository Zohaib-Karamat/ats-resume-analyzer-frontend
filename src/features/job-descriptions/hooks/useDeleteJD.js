import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jobDescriptionApi } from "../api/jobDescriptionApi";
import toast from "react-hot-toast";

export function useDeleteJD() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => jobDescriptionApi.delete(id),
    onSuccess: () => {
      toast.success("Job description deleted");
      queryClient.invalidateQueries(["job-descriptions"]);
      queryClient.invalidateQueries(["dashboard", "summary"]);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete job description");
    },
  });
}
