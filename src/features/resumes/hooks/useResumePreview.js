import { useEffect, useState } from "react";
import api from "../../../lib/axios";
import { getResumeFileUrl, isPdfResume } from "../../../lib/fileUrl";
import { useAuthStore } from "../../auth/store/authStore";

async function fetchBlobFromUrl(url) {
  const token = useAuthStore.getState().token;
  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    throw new Error(`Failed to load resume file (${response.status})`);
  }

  return response.blob();
}

async function fetchResumeBlob(resume) {
  const resumeId = resume?.id ?? resume?._id;

  if (resumeId) {
    for (const endpoint of [`/resumes/${resumeId}/file`, `/resumes/${resumeId}/download`]) {
      try {
        const response = await api.get(endpoint, { responseType: "blob" });
        if (response.data instanceof Blob && response.data.size > 0) {
          return response.data;
        }
      } catch {
        // Try the next endpoint or fall back to the resolved file URL.
      }
    }
  }

  const fileUrl = getResumeFileUrl(resume);
  if (!fileUrl) return null;

  return fetchBlobFromUrl(fileUrl);
}

function toPdfBlob(blob) {
  if (!(blob instanceof Blob)) return null;

  const type = blob.type?.toLowerCase() ?? "";
  if (type.includes("pdf") || type === "application/octet-stream" || !type) {
    return new Blob([blob], { type: "application/pdf" });
  }

  return blob;
}

export function useResumePreview(resume, enabled) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const directUrl = resume ? getResumeFileUrl(resume) : null;
  const canPreview = Boolean(resume && isPdfResume(resume));

  useEffect(() => {
    if (!enabled || !resume || !canPreview) {
      setPreviewUrl(null);
      setError(null);
      setIsLoading(false);
      return undefined;
    }

    let objectUrl = null;
    let cancelled = false;

    async function loadPreview() {
      setIsLoading(true);
      setError(null);
      setPreviewUrl(null);

      try {
        const blob = await fetchResumeBlob(resume);
        if (cancelled || !blob) return;

        const previewBlob = toPdfBlob(blob);
        objectUrl = URL.createObjectURL(previewBlob);
        setPreviewUrl(objectUrl);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to load preview"));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadPreview();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [enabled, resume?.id, resume?.fileUrl, resume?.name, resume?.mimeType, canPreview]);

  const openFile = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (directUrl) {
      window.open(directUrl, "_blank", "noopener,noreferrer");
    }
  };

  return {
    previewUrl,
    directUrl,
    isLoading,
    error,
    canPreview,
    openFile,
  };
}
