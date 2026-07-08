import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeApi } from "../api/resumeApi";
import toast from "react-hot-toast";

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => resumeApi.deleteResume(id),
    onSuccess: (_data, id) => {
      toast.success("Resume deleted");
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["resume", id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
}
