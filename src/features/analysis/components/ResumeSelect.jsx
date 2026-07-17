import { useResumes } from "../../resumes/hooks/useResumes";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Card, CardContent } from "../../../components/ui/Card";
import { FileText, CheckCircle2 } from "lucide-react";
import { cn } from "../../../lib/utils";

export function ResumeSelect({ selectedId, onSelect }) {
  const { data: resumes, isLoading } = useResumes();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>
    );
  }

  if (!resumes || resumes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No resumes found. Please upload one first.</p>
      </div>
    );
  }

  return (
    <div className="grid max-h-[290px] grid-cols-1 gap-3 overflow-y-auto p-1 sm:max-h-[300px]">
      {resumes.map((resume) => (
        <Card
          key={resume.id}
          className={cn(
            "cursor-pointer transition-all hover:border-indigo-300 dark:hover:border-indigo-700",
            selectedId === resume.id
              ? "border-2 border-indigo-500 bg-indigo-50/30 dark:border-indigo-500 dark:bg-indigo-900/20"
              : "border border-zinc-200 dark:border-zinc-800"
          )}
          onClick={() => onSelect(resume.id)}
        >
          <CardContent className="flex items-center justify-between gap-3 p-4">
            <div className="flex min-w-0 items-center space-x-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">{resume.name}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {new Date(resume.uploadDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            {selectedId === resume.id && (
              <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
