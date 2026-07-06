import { useState } from "react";
import { Briefcase, Building, Calendar, Edit2, Trash2 } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/Card";
import { IconButton } from "../../../components/ui/IconButton";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { useDeleteJD } from "../hooks/useDeleteJD";

export function JDCard({ jd, onEdit }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { mutate: deleteJD, isPending } = useDeleteJD();

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
                <div className="flex shrink-0 space-x-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 -mt-1 -mr-1">
                  <IconButton variant="ghost" size="sm" title="Edit" onClick={() => onEdit(jd)}>
                    <Edit2 className="h-4 w-4" />
                  </IconButton>
                  <IconButton 
                    variant="ghost" 
                    size="sm" 
                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-500 dark:hover:bg-rose-950/50"
                    title="Delete"
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-1 bg-zinc-100 px-2 py-1 rounded-md dark:bg-zinc-800">
                  <Building className="h-3 w-3" />
                  <span className="truncate max-w-[120px]">{jd.company}</span>
                </div>
                <div className="flex items-center gap-1 bg-zinc-100 px-2 py-1 rounded-md dark:bg-zinc-800">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(jd.date).toLocaleDateString()}</span>
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
        isOpen={isDeleteModalOpen} 
        onClose={() => !isPending && setIsDeleteModalOpen(false)}
        title="Delete Job Description"
      >
        <div className="space-y-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Are you sure you want to delete <span className="font-semibold text-zinc-900 dark:text-zinc-100">{jd.title} at {jd.company}</span>? This action cannot be undone.
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
