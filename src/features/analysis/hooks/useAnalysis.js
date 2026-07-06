import { useQuery } from "@tanstack/react-query";
import { analysisApi } from "../api/analysisApi";

export function useAnalysis(id) {
  return useQuery({
    queryKey: ["analysis", id],
    queryFn: () => analysisApi.getAnalysisById(id),
    enabled: !!id, // Only run if we have an ID
  });
}
