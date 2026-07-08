import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jobDescriptionApi } from "../api/jobDescriptionApi";
import toast from "react-hot-toast";

export function useCreateJD() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => jobDescriptionApi.create(data),
    onSuccess: () => {
      toast.success("Job description saved");
      queryClient.invalidateQueries({ queryKey: ["job-descriptions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
}
