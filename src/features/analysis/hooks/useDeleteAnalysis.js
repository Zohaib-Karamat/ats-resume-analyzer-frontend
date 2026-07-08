import { useMutation, useQueryClient } from "@tanstack/react-query";
import { analysisApi } from "../api/analysisApi";
import toast from "react-hot-toast";

export function useDeleteAnalysis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => analysisApi.deleteAnalysis(id),
    onSuccess: (_data, id) => {
      toast.success("Analysis deleted");
      queryClient.invalidateQueries({ queryKey: ["analysis", "history"] });
      queryClient.invalidateQueries({ queryKey: ["analysis", id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
}
