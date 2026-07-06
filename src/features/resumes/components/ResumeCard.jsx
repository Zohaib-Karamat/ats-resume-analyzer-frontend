import { useState } from "react";
import { FileText, Trash2, Eye } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/Card";
import { IconButton } from "../../../components/ui/IconButton";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { useDeleteResume } from "../hooks/useDeleteResume";

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function ResumeCard({ resume }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: deleteResume, isPending } = useDeleteResume();

  const handleDelete = () => {
    deleteResume(resume.id, {
      onSuccess: () => setIsModalOpen(false)
    });
  };

  return (
    <>
      <Card className="group relative overflow-hidden transition-all hover:shadow-md dark:hover:border-zinc-700">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100" title={resume.name}>
                  {resume.name}
                </p>
                <div className="mt-1 flex items-center space-x-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{formatBytes(resume.size)}</span>
                  <span>•</span>
                  <span>{new Date(resume.uploadDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 space-x-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
              <IconButton variant="ghost" size="sm" title="View">
                <Eye className="h-4 w-4" />
              </IconButton>
              <IconButton 
                variant="ghost" 
                size="sm" 
                className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-500 dark:hover:bg-rose-950/50"
                title="Delete"
                onClick={() => setIsModalOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
              </IconButton>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isPending && setIsModalOpen(false)}
        title="Delete Resume"
      >
        <div className="space-y-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Are you sure you want to delete <span className="font-semibold text-zinc-900 dark:text-zinc-100">{resume.name}</span>? This action cannot be undone and will remove it from all associated analyses.
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              variant="ghost" 
              onClick={() => setIsModalOpen(false)}
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
