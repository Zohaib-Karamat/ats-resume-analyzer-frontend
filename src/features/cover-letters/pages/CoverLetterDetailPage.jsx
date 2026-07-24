import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Trash2, Loader2, AlertCircle, Calendar } from "lucide-react";
import { useCoverLetter, useDeleteCoverLetter, useDownloadCoverLetterPdf } from "../hooks/useCoverLetters";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";

export function CoverLetterDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: coverLetter, isLoading, error } = useCoverLetter(id);
  const deleteMutation = useDeleteCoverLetter();
  const downloadMutation = useDownloadCoverLetterPdf();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        navigate("/cover-letters");
      },
    });
  };

  const handleDownload = () => {
    downloadMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  if (error || !coverLetter) {
    return (
      <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              Failed to load cover letter details
            </h3>
            <div className="mt-4">
              <Link
                to="/cover-letters"
                className="text-sm font-medium text-red-800 hover:text-red-900 dark:text-red-300 dark:hover:text-red-200 flex items-center"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Cover Letters
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <Link
          to="/cover-letters"
          className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to list
        </Link>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownload}
            disabled={downloadMutation.isPending}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-800 transition-colors"
          >
            {downloadMutation.isPending ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-1.5 h-4 w-4" />
            )}
            Download PDF
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:hover:bg-red-500 dark:focus:ring-offset-zinc-900 transition-colors"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-1.5 h-4 w-4" />
            )}
            Delete
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
        <div className="border-b border-zinc-200 bg-zinc-50 px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                {coverLetter.jobDescription?.title || "Cover Letter"}
              </h2>
              {coverLetter.jobDescription?.company && (
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {coverLetter.jobDescription.company}
                </p>
              )}
            </div>
            <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
              <Calendar className="mr-1.5 h-4 w-4" />
              {new Date(coverLetter.createdAt || Date.now()).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="px-6 py-8 prose prose-zinc dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap font-serif text-zinc-800 dark:text-zinc-300 leading-relaxed">
            {coverLetter.content || coverLetter.body || "No content generated."}
          </div>
        </div>
      </div>
      <Modal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Delete Cover Letter"
      >
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Are you sure you want to delete this cover letter? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => setIsDeleteDialogOpen(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={confirmDelete}
            isLoading={deleteMutation.isPending}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
