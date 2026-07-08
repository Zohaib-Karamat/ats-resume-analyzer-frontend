import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jobDescriptionApi } from "../api/jobDescriptionApi";
import toast from "react-hot-toast";

export function useUpdateJD() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params) => jobDescriptionApi.update(params),
    onSuccess: (_data, variables) => {
      toast.success("Job description updated");
      queryClient.invalidateQueries({ queryKey: ["job-descriptions"] });
      queryClient.invalidateQueries({
        queryKey: ["job-description", variables.id],
      });
    },
  });
}
