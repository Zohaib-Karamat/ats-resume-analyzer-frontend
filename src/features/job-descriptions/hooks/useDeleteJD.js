import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jobDescriptionApi } from "../api/jobDescriptionApi";
import toast from "react-hot-toast";

export function useDeleteJD() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => jobDescriptionApi.delete(id),
    onSuccess: (_data, id) => {
      toast.success("Job description deleted");
      queryClient.invalidateQueries({ queryKey: ["job-descriptions"] });
      queryClient.invalidateQueries({ queryKey: ["job-description", id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
}
