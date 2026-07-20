import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Plus, FileText, Trash2, Download, AlertCircle, Loader2 } from "lucide-react";
import { useCoverLetters, useDeleteCoverLetter, useDownloadCoverLetterPdf } from "../hooks/useCoverLetters";
import { GenerateCoverLetterModal } from "../components/GenerateCoverLetterModal";

export function CoverLettersPage() {
  const { data: coverLetters, isLoading, error } = useCoverLetters();
  const deleteMutation = useDeleteCoverLetter();
  const downloadMutation = useDownloadCoverLetterPdf();
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this cover letter?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDownload = (id) => {
    downloadMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Cover Letters
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Generate and manage your AI-tailored cover letters.
          </p>
        </div>
        <button
          onClick={() => setIsGenerateModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:hover:bg-indigo-500 dark:focus:ring-offset-zinc-900 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Generate New
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
        </div>
      ) : error ? (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Failed to load cover letters
              </h3>
            </div>
          </div>
        </div>
      ) : coverLetters?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 p-12 text-center">
          <Mail className="h-12 w-12 text-zinc-400 dark:text-zinc-500 mb-4" />
          <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">No cover letters</h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Get started by generating your first cover letter based on a resume and job description.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setIsGenerateModalOpen(true)}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Generate Cover Letter
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coverLetters?.map((cl) => (
            <div
              key={cl._id || cl.id}
              className="flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:shadow-md"
            >
              <div className="p-5 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                    <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {new Date(cl.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-1 line-clamp-1">
                  {cl.jobTitle || "Cover Letter"}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                  {cl.companyName || "For selected job description"}
                </p>
              </div>
              <div className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4 flex justify-between items-center">
                <Link
                  to={`/cover-letters/${cl._id || cl.id}`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  View Details
                </Link>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(cl._id || cl.id)}
                    disabled={downloadMutation.isPending}
                    className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-md transition-colors"
                    title="Download PDF"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cl._id || cl.id)}
                    disabled={deleteMutation.isPending}
                    className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-md transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isGenerateModalOpen && (
        <GenerateCoverLetterModal
          isOpen={isGenerateModalOpen}
          onClose={() => setIsGenerateModalOpen(false)}
        />
      )}
    </div>
  );
}
