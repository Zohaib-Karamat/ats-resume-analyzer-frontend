const DEFAULT_API_URL = "http://localhost:5000/api";

export function getApiBaseUrl() {
  return import.meta.env.VITE_API_URL || DEFAULT_API_URL;
}

export function getApiOrigin() {
  try {
    const url = new URL(getApiBaseUrl());
    url.pathname = url.pathname.replace(/\/api\/?$/, "");
    return url.origin + url.pathname.replace(/\/$/, "");
  } catch {
    return "http://localhost:5000";
  }
}

export function resolveAssetUrl(pathOrUrl) {
  if (!pathOrUrl || typeof pathOrUrl !== "string") return null;

  const trimmed = pathOrUrl.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed) || /^blob:/i.test(trimmed)) return trimmed;

  const normalized = trimmed.replace(/\\/g, "/");
  const origin = getApiOrigin();

  if (normalized.startsWith("/")) return `${origin}${normalized}`;
  return `${origin}/${normalized}`;
}

export function getResumeFileUrl(resume) {
  if (!resume) return null;

  const directPath =
    resume.fileUrl ??
    resume.url ??
    resume.downloadUrl ??
    resume.path ??
    resume.filePath ??
    resume.file?.path ??
    resume.file?.url ??
    null;

  if (directPath) return resolveAssetUrl(directPath);

  if (resume.id) {
    return `${getApiBaseUrl()}/resumes/${resume.id}/file`;
  }

  return null;
}

export function isPdfResume(resume) {
  const mimeType = resume?.mimeType ?? resume?.type ?? "";
  const name = resume?.name ?? resume?.fileName ?? "";
  return (
    /pdf/i.test(mimeType) ||
    /\.pdf$/i.test(name) ||
    (!mimeType && !/\.(docx?|doc)$/i.test(name))
  );
}
