import { useMutation, useQueryClient } from "@tanstack/react-query";
import { analysisApi } from "../api/analysisApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useCreateAnalysis() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ resumeId, jdId }) =>
      analysisApi.createAnalysis({ resumeId, jobDescriptionId: jdId }),
    onSuccess: (data) => {
      toast.success("Analysis complete!");
      queryClient.invalidateQueries({ queryKey: ["analysis", "history"] });
      navigate(`/analysis/${data.id}`);
    },
  });
}
