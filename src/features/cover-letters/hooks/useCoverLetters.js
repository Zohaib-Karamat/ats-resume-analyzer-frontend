import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { coverLettersApi } from "../api/coverLettersApi";
import toast from "react-hot-toast";
import { useElapsedTimer } from "../../../hooks/useElapsedTimer";

export const useCoverLetters = () => {
  return useQuery({
    queryKey: ["cover-letters"],
    queryFn: coverLettersApi.getAll,
  });
};

export const useCoverLetter = (id) => {
  return useQuery({
    queryKey: ["cover-letters", id],
    queryFn: () => coverLettersApi.getById(id),
    enabled: !!id,
  });
};

export const useGenerateCoverLetter = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: coverLettersApi.generate,
    onSuccess: (resData) => {
      queryClient.invalidateQueries({ queryKey: ["cover-letters"] });
      toast.success(resData?.message || "Cover letter generated successfully!");
    },
  });

  // Track elapsed seconds while the mutation is in flight
  const elapsed = useElapsedTimer(mutation.isPending);

  return { ...mutation, elapsed };
};

export const useDeleteCoverLetter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coverLettersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cover-letters"] });
      toast.success("Cover letter deleted successfully!");
    },
  });
};

export const useDownloadCoverLetterPdf = () => {
  return useMutation({
    mutationFn: coverLettersApi.downloadPdf,
    onSuccess: (blob, id) => {
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `cover-letter-${id}.pdf`);
      // Append to the body, click and remove
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Cover letter downloaded!");
    },
    onError: () => {
      toast.error("Failed to download PDF.");
    }
  });
};
