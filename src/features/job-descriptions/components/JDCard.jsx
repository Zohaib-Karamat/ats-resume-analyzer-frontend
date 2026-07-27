import { useState } from "react";
import { Building, Calendar, Edit2, Eye, Trash2, Copy, Check } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/Card";
import { IconButton } from "../../../components/ui/IconButton";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { QueryErrorState } from "../../../components/ui/States";
import { useDeleteJD } from "../hooks/useDeleteJD";
import { useJobDescription } from "../hooks/useJobDescription";

function formatDate(date) {
  if (!date) return "Unknown date";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Unknown date";
  return parsed.toLocaleDateString();
}

export function JDCard({ jd, onEdit }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { mutate: deleteJD, isPending } = useDeleteJD();
  const {
    data: jdDetails,
    isLoading: isLoadingDetails,
    isError: isDetailsError,
    refetch: refetchDetails,
  } = useJobDescription(jd.id, { enabled: isDetailsModalOpen });

  const displayJD = jdDetails || jd;

  const handleCopy = () => {
    const text = [displayJD.title, displayJD.company, displayJD.content].filter(Boolean).join("\n\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDelete = () => {
    deleteJD(jd.id, {
      onSuccess: () => setIsDeleteModalOpen(false)
    });
  };

  return (
    <>
      <Card className="group relative overflow-hidden transition-all hover:shadow-md dark:hover:border-zinc-700">
        <CardContent className="p-5">
          <div className="flex flex-col justify-between h-full space-y-4">
            <div>
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-zinc-900 line-clamp-1 dark:text-zinc-100" title={jd.title}>
                  {jd.title}
                </h3>
                <div className="-mr-1 -mt-1 flex shrink-0 space-x-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
                  <IconButton
                    variant="ghost"
                    size="sm"
                    title="View"
                    aria-label={`View ${jd.title}`}
                    onClick={() => setIsDetailsModalOpen(true)}
                  >
                    <Eye className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    title="Edit"
                    aria-label={`Edit ${jd.title}`}
                    onClick={() => onEdit(jd)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </IconButton>
                  <IconButton 
                    variant="ghost" 
                    size="sm" 
                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-500 dark:hover:bg-rose-950/50"
                    title="Delete"
                    aria-label={`Delete ${jd.title}`}
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-1 bg-zinc-100 px-2 py-1 rounded-md dark:bg-zinc-800">
                  <Building className="h-3 w-3" />
                  <span className="max-w-[160px] truncate sm:max-w-[120px]">{jd.company}</span>
                </div>
                <div className="flex items-center gap-1 bg-zinc-100 px-2 py-1 rounded-md dark:bg-zinc-800">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(jd.date)}</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-zinc-600 line-clamp-3 dark:text-zinc-400">
              {jd.content}
            </p>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Job Description"
        className="max-w-3xl"
      >
        {isDetailsError ? (
          <QueryErrorState
            onRetry={refetchDetails}
            message="We could not load this job description."
            className="p-6"
          />
        ) : isLoadingDetails ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                {displayJD.title}
              </h3>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
                  <Building className="h-3 w-3" />
                  <span>{displayJD.company}</span>
                </div>
                <div className="flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(displayJD.date)}</span>
                </div>
                <button
                  onClick={handleCopy}
                  title={copied ? "Copied!" : "Copy to clipboard"}
                  className="ml-auto inline-flex items-center rounded-md bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-800 transition-colors"
                >
                  {copied ? (
                    <><Check className="mr-1.5 h-3.5 w-3.5 text-green-500" /><span>Copied!</span></>
                  ) : (
                    <><Copy className="mr-1.5 h-3.5 w-3.5" /><span>Copy</span></>
                  )}
                </button>
              </div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
              <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                {displayJD.content}
              </p>
            </div>
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => !isPending && setIsDeleteModalOpen(false)}
        title="Delete Job Description"
      >
        <div className="space-y-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Are you sure you want to delete <span className="font-semibold text-zinc-900 dark:text-zinc-100">{jd.title} at {jd.company}</span>? This action cannot be undone.
          </p>
          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
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
