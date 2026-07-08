import { useQuery } from "@tanstack/react-query";
import { resumeApi } from "../api/resumeApi";

export function useResume(id, options = {}) {
  return useQuery({
    queryKey: ["resume", id],
    queryFn: () => resumeApi.fetchResumeById(id),
    enabled: Boolean(id) && (options.enabled ?? true),
  });
}
