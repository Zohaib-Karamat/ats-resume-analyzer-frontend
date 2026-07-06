import { useQuery } from "@tanstack/react-query";
import { analysisApi } from "../api/analysisApi";

export function useAnalysisHistory() {
  return useQuery({
    queryKey: ["analysis", "history"],
    queryFn: () => analysisApi.getAnalysisHistory(),
  });
}
