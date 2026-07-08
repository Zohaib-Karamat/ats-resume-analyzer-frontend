import { useState } from "react";
import { FileText, Trash2, Eye, ExternalLink } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/Card";
import { IconButton } from "../../../components/ui/IconButton";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { Skeleton } from "../../../components/ui/Skeleton";
import { QueryErrorState } from "../../../components/ui/States";
import { useDeleteResume } from "../hooks/useDeleteResume";
import { useResume } from "../hooks/useResume";

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function formatDate(date) {
  if (!date) return "Unknown date";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Unknown date";
  return parsed.toLocaleDateString();
}

function getResumePreviewUrl(resume) {
  const url = resume?.fileUrl ?? resume?.url ?? resume?.downloadUrl ?? resume?.path ?? null;
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const normalizedUrl = url.replace(/\\/g, "/");
  if (normalizedUrl.startsWith("/")) return `http://localhost:5000${normalizedUrl}`;
  if (normalizedUrl.startsWith("uploads/")) return `http://localhost:5000/${normalizedUrl}`;
  return url;
}

function getParsedData(resume) {
  return resume?.parsedData ?? resume?.parsedResume ?? resume?.parsed ?? null;
}

function getDisplayValue(object, keys) {
  if (!object || typeof object !== "object") return null;
  return keys.map((key) => object[key]).find((value) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && value !== "";
  });
}

function renderValue(value) {
  if (value === undefined || value === null || value === "") return null;

  if (Array.isArray(value)) {
    if (!value.length) return null;
    return (
      <div className="flex flex-wrap gap-2">
        {value.map((item, index) => (
          <span
            key={`${String(item)}-${index}`}
            className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {typeof item === "object" ? stringifyCompact(item) : String(item)}
          </span>
        ))}
      </div>
    );
  }

  if (typeof value === "object") {
    return (
      <div className="space-y-2">
        {Object.entries(value).map(([key, item]) => (
          <div key={key} className="grid gap-1 sm:grid-cols-[120px_1fr]">
            <span className="text-xs font-medium capitalize text-zinc-500 dark:text-zinc-400">
              {key.replace(/([A-Z])/g, " $1")}
            </span>
            <span className="text-sm text-zinc-800 dark:text-zinc-200">
              {Array.isArray(item) ? item.join(", ") : stringifyCompact(item)}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-300">
      {String(value)}
    </p>
  );
}

function stringifyCompact(value) {
  if (value === undefined || value === null) return "";
  if (typeof value !== "object") return String(value);
  return Object.values(value)
    .flat()
    .filter(Boolean)
    .join(" | ");
}

function ParsedSection({ title, value }) {
  const rendered = renderValue(value);
  if (!rendered) return null;

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <h4 className="mb-3 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
        {title}
      </h4>
      {rendered}
    </section>
  );
}

function ParsedResumeView({ resume }) {
  const parsedData = getParsedData(resume);
  if (!parsedData || typeof parsedData !== "object") return null;

  const contact = getDisplayValue(parsedData, ["contact", "personalInfo", "personalInformation"]);
  const summary = getDisplayValue(parsedData, ["summary", "professionalSummary", "objective"]);
  const skills = getDisplayValue(parsedData, ["skills", "technicalSkills", "keySkills"]);
  const experience = getDisplayValue(parsedData, ["experience", "workExperience", "employment"]);
  const education = getDisplayValue(parsedData, ["education", "academics"]);
  const projects = getDisplayValue(parsedData, ["projects"]);
  const certifications = getDisplayValue(parsedData, ["certifications", "certificates"]);
  const extractedText = getDisplayValue(parsedData, ["text", "rawText", "extractedText", "content"]);

  return (
    <div className="space-y-4">
      <ParsedSection title="Contact" value={contact} />
      <ParsedSection title="Summary" value={summary} />
      <ParsedSection title="Skills" value={skills} />
      <ParsedSection title="Experience" value={experience} />
      <ParsedSection title="Education" value={education} />
      <ParsedSection title="Projects" value={projects} />
      <ParsedSection title="Certifications" value={certifications} />
      <ParsedSection title="Extracted Text" value={extractedText} />
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-zinc-100 py-3 last:border-0 dark:border-zinc-800">
      <dt className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>
      <dd className="min-w-0 text-right text-sm text-zinc-900 dark:text-zinc-100">
        {value}
      </dd>
    </div>
  );
}

export function ResumeCard({ resume }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { mutate: deleteResume, isPending } = useDeleteResume();
  const {
    data: resumeDetails,
    isLoading: isLoadingDetails,
    isError: isDetailsError,
    refetch: refetchDetails,
  } = useResume(resume.id, { enabled: isDetailsModalOpen });

  const displayResume = resumeDetails || resume;
  const previewUrl = getResumePreviewUrl(displayResume);

  const handleDelete = () => {
    deleteResume(resume.id, {
      onSuccess: () => setIsDeleteModalOpen(false),
    });
  };

  return (
    <>
      <Card className="group relative overflow-hidden transition-all hover:shadow-md dark:hover:border-zinc-700">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex min-w-0 items-center space-x-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100"
                  title={resume.name}
                >
                  {resume.name}
                </p>
                <div className="mt-1 flex items-center space-x-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{formatBytes(resume.size)}</span>
                  <span aria-hidden="true">{"\u2022"}</span>
                  <span>{formatDate(resume.uploadDate)}</span>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 space-x-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
              <IconButton
                variant="ghost"
                size="sm"
                title="View"
                aria-label={`View ${resume.name}`}
                onClick={() => setIsDetailsModalOpen(true)}
              >
                <Eye className="h-4 w-4" />
              </IconButton>
              <IconButton
                variant="ghost"
                size="sm"
                className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-500 dark:hover:bg-rose-950/50"
                title="Delete"
                aria-label={`Delete ${resume.name}`}
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
              </IconButton>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Resume Details"
        className="max-w-5xl"
      >
        {isDetailsError ? (
          <QueryErrorState
            onRetry={refetchDetails}
            message="We could not load this resume."
            className="p-6"
          />
        ) : isLoadingDetails ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="break-words text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                    {displayResume.name}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Resume ID: {displayResume.id}
                  </p>
                </div>
              </div>

              {previewUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open file
                </a>
              )}
            </div>

            <dl className="grid gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40 sm:grid-cols-3">
              <DetailRow label="File size" value={formatBytes(displayResume.size)} />
              <DetailRow label="Uploaded" value={formatDate(displayResume.uploadDate)} />
              <DetailRow label="Type" value={displayResume.mimeType || "Resume file"} />
            </dl>

            {previewUrl && (
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
                <iframe
                  title={displayResume.name}
                  src={previewUrl}
                  className="h-[70vh] w-full bg-white"
                />
              </div>
            )}

            <ParsedResumeView resume={displayResume} />

            {!previewUrl && !getParsedData(displayResume) && (
              <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
                <FileText className="mx-auto h-6 w-6 text-zinc-400" />
                <p className="mt-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  No preview data available
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  The server returned metadata, but no PDF URL or parsed resume
                  content for this file.
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !isPending && setIsDeleteModalOpen(false)}
        title="Delete Resume"
      >
        <div className="space-y-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {resume.name}
            </span>
            ? This action cannot be undone and will remove it from all associated
            analyses.
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              isLoading={isPending}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
