import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { X, Loader2 } from "lucide-react";
import { useGenerateCoverLetter } from "../hooks/useCoverLetters";
import { useResumes } from "../../resumes/hooks/useResumes";
import { useJobDescriptions } from "../../job-descriptions/hooks/useJobDescriptions";
import { applyServerFieldErrors } from "../../../lib/errorUtils";

export function GenerateCoverLetterModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const { data: resumes, isLoading: isLoadingResumes } = useResumes();
  const { data: jdData, isLoading: isLoadingJds } = useJobDescriptions({ limit: 50 });
  const generateMutation = useGenerateCoverLetter();

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const onSubmit = (data) => {
    generateMutation.mutate(
      {
        resumeId: data.resumeId,
        jobDescriptionId: data.jobDescriptionId,
      },
      {
        onSuccess: (resData) => {
          onClose();
          const coverLetter = resData?.data;
          if (coverLetter && (coverLetter._id || coverLetter.id)) {
            navigate(`/cover-letters/${coverLetter._id || coverLetter.id}`);
          }
        },
        onError: (error) => {
          applyServerFieldErrors(error, setError);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Generate Cover Letter
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="resumeId"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Select Resume
            </label>
            <select
              id="resumeId"
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
              {...register("resumeId", { required: "Resume is required" })}
              disabled={isLoadingResumes || !resumes?.length}
            >
              <option value="">-- Choose a resume --</option>
              {resumes?.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.name}
                </option>
              ))}
            </select>
            {errors.resumeId && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.resumeId.message}
              </p>
            )}
            {!isLoadingResumes && resumes?.length === 0 && (
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                No resumes found. Please upload one first.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="jobDescriptionId"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Select Job Description
            </label>
            <select
              id="jobDescriptionId"
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
              {...register("jobDescriptionId", {
                required: "Job description is required",
              })}
              disabled={isLoadingJds || !jdData?.data?.length}
            >
              <option value="">-- Choose a job description --</option>
              {jdData?.data?.map((jd) => (
                <option key={jd.id} value={jd.id}>
                  {jd.title} {jd.company ? `at ${jd.company}` : ""}
                </option>
              ))}
            </select>
            {errors.jobDescriptionId && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.jobDescriptionId.message}
              </p>
            )}
            {!isLoadingJds && jdData?.data?.length === 0 && (
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                No job descriptions found. Please add one first.
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:focus:ring-offset-zinc-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={generateMutation.isPending || !resumes?.length || !jdData?.data?.length}
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:hover:bg-indigo-500 dark:focus:ring-offset-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
