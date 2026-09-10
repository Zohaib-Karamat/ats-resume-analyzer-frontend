import { useMutation, useQueryClient } from "@tanstack/react-query";
import { analysisApi } from "../api/analysisApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useElapsedTimer } from "../../../hooks/useElapsedTimer";

export function useCreateAnalysis() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async ({ resumeId, jdId }) => {
      let history = queryClient.getQueryData(["analysis", "history"]);
      if (!history) {
        history = await analysisApi.getAnalysisHistory();
      }

      const existing = history?.find(
        (h) => h.resumeId === resumeId && h.jdId === jdId
      );

      if (existing) {
        return { ...existing, _isExisting: true };
      }

      return analysisApi.createAnalysis({ resumeId, jobDescriptionId: jdId });
    },
    onSuccess: (data) => {
      if (data._isExisting) {
        toast.success("Analysis already exists.");
      } else if (data._originalMessage) {
        toast.success(data._originalMessage);
      } else {
        toast.success("Analysis complete!");
      }
      queryClient.setQueryData(["analysis", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["analysis", "history"] });
      navigate(`/analysis/${data.id}`);
    },
  });

  // Track elapsed seconds while the mutation is in flight
  const elapsed = useElapsedTimer(mutation.isPending);

  return { ...mutation, elapsed };
}
