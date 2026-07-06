import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeApi } from "../api/resumeApi";
import toast from "react-hot-toast";

export function useUploadResume() {
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (file) => {
      setProgress(0);
      return resumeApi.uploadResume(file, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percentCompleted);
      });
    },
    onSuccess: () => {
      toast.success("Resume uploaded successfully");
      queryClient.invalidateQueries(["resumes"]);
      queryClient.invalidateQueries(["dashboard", "summary"]); // Invalidate dashboard stats too
      setProgress(0);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload resume");
      setProgress(0);
    },
  });

  return { ...mutation, progress };
}
