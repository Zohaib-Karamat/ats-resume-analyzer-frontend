import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeApi } from "../api/resumeApi";
import toast from "react-hot-toast";

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => resumeApi.deleteResume(id),
    onSuccess: () => {
      toast.success("Resume deleted");
      queryClient.invalidateQueries(["resumes"]);
      queryClient.invalidateQueries(["dashboard", "summary"]);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete resume");
    },
  });
}
