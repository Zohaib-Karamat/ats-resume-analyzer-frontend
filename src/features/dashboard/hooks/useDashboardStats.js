import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboardApi";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardApi.fetchDashboardSummary,
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });
}
