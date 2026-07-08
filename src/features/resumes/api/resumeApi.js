import api from "../../../lib/axios";

const FILE_NAME_KEYS = [
  "originalName",
  "originalname",
  "originalFileName",
  "originalFilename",
  "fileName",
  "filename",
  "name",
  "title",
];

const FILE_SIZE_KEYS = ["size", "fileSize", "bytes"];
const FILE_URL_KEYS = ["url", "fileUrl", "downloadUrl", "secureUrl", "path", "filePath"];
const MIME_TYPE_KEYS = ["mimeType", "mimetype", "contentType", "type"];
const DATE_KEYS = ["uploadDate", "uploadedAt", "createdAt", "updatedAt"];

function unwrapData(response) {
  return response.data?.data ?? response.data;
}

function pickFirstString(...values) {
  return values.find((value) => typeof value === "string" && value.trim())?.trim();
}

function pickFromObject(object, keys) {
  if (!object || typeof object !== "object") return undefined;

  for (const key of keys) {
    const value = object[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return value;
  }

  return undefined;
}

function getNestedSources(resume) {
  return [
    resume,
    resume?.file,
    resume?.resumeFile,
    resume?.metadata,
    resume?.fileMetadata,
    resume?.parsed,
    resume?.parsedData,
    resume?.parsedResume,
    resume?.resume,
  ];
}

function normalizeResume(resume) {
  if (!resume) return resume;

  const id = resume.id ?? resume._id;
  const sources = getNestedSources(resume);
  const name = pickFirstString(
    ...sources.map((source) => pickFromObject(source, FILE_NAME_KEYS)),
  ) ?? "Untitled resume";
  const size = sources
    .map((source) => pickFromObject(source, FILE_SIZE_KEYS))
    .find((value) => typeof value === "number") ?? 0;
  const uploadDate = pickFirstString(
    ...sources.map((source) => pickFromObject(source, DATE_KEYS)),
  ) ?? null;
  const mimeType = pickFirstString(
    ...sources.map((source) => pickFromObject(source, MIME_TYPE_KEYS)),
  );
  const fileUrl = pickFirstString(
    ...sources.map((source) => pickFromObject(source, FILE_URL_KEYS)),
  );
  const parsedData =
    resume.parsedData ??
    resume.parsedResume ??
    resume.parsed ??
    resume.resume?.parsedData ??
    (resume.extractedText ? { extractedText: resume.extractedText } : null) ??
    null;

  return {
    ...resume,
    id,
    name,
    size,
    uploadDate,
    mimeType,
    fileUrl,
    parsedData,
  };
}

function normalizeResumeList(payload) {
  const resumes = Array.isArray(payload)
    ? payload
    : payload?.resumes ?? payload?.data ?? payload?.items ?? [];

  return resumes.map(normalizeResume);
}

function normalizeResumePayload(payload) {
  return normalizeResume(payload?.resume ?? payload);
}

export const resumeApi = {
  fetchResumes: async () => {
    const response = await api.get("/resumes");
    return normalizeResumeList(unwrapData(response));
  },

  fetchResumeById: async (id) => {
    const response = await api.get(`/resumes/${id}`);
    return normalizeResumePayload(unwrapData(response));
  },

  uploadResume: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append("resumeFile", file);

    const response = await api.post("/resumes/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });

    return normalizeResumePayload(unwrapData(response));
  },

  deleteResume: async (id) => {
    const response = await api.delete(`/resumes/${id}`);
    return unwrapData(response);
  },
};
