import { useResumes } from "../hooks/useResumes";
import { UploadDropzone } from "../components/UploadDropzone";
import { ResumeCard } from "../components/ResumeCard";
import { Skeleton } from "../../../components/ui/Skeleton";
import { QueryErrorState } from "../../../components/ui/States";
import { FileText } from "lucide-react";

export function ResumesPage() {
  const { data: resumes, isLoading, isError, refetch } = useResumes();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          My Resumes
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Upload and manage your base resumes to use in ATS analysis.
        </p>
      </div>

      <UploadDropzone />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Uploaded Files
        </h2>

        {isError ? (
          <QueryErrorState
            onRetry={refetch}
            message="We could not load your resumes from the server."
          />
        ) : isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-[var(--radius-lg)]" />
            ))}
          </div>
        ) : resumes && resumes.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="rounded-full bg-zinc-200/50 p-3 dark:bg-zinc-800/50">
              <FileText className="h-6 w-6 text-zinc-400" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">No resumes</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Get started by uploading a resume above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
