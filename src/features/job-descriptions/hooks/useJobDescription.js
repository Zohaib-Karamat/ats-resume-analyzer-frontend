import { useQuery } from "@tanstack/react-query";
import { jobDescriptionApi } from "../api/jobDescriptionApi";

export function useJobDescription(id, options = {}) {
  return useQuery({
    queryKey: ["job-description", id],
    queryFn: () => jobDescriptionApi.getById(id),
    enabled: Boolean(id) && (options.enabled ?? true),
  });
}
