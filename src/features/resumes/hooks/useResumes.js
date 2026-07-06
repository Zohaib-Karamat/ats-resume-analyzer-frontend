import { useQuery } from "@tanstack/react-query";
import { resumeApi } from "../api/resumeApi";

export function useResumes() {
  return useQuery({
    queryKey: ["resumes"],
    queryFn: resumeApi.fetchResumes,
  });
}
