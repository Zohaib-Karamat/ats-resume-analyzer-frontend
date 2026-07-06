import { useQuery } from "@tanstack/react-query";
import { jobDescriptionApi } from "../api/jobDescriptionApi";

export function useJobDescriptions(params) {
  return useQuery({
    queryKey: ["job-descriptions", params],
    queryFn: () => jobDescriptionApi.list(params),
    keepPreviousData: true, // Smoother pagination
  });
}
