import { useJobDescriptions } from "../../job-descriptions/hooks/useJobDescriptions";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Card, CardContent } from "../../../components/ui/Card";
import { Briefcase, CheckCircle2 } from "lucide-react";
import { cn } from "../../../lib/utils";

export function JobDescriptionSelect({ selectedId, onSelect }) {
  // Pass empty search and page 1. In a real app we might want a paginated/searchable dropdown here,
  // but for now we fetch the first page to allow selection.
  const { data, isLoading } = useJobDescriptions({ search: "", page: 1, limit: 10 });
  const jds = data?.data || [];
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>
    );
  }

  if (!jds || jds.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No job descriptions found. Please add one first.</p>
      </div>
    );
  }

  return (
    <div className="grid max-h-[290px] grid-cols-1 gap-3 overflow-y-auto p-1 sm:max-h-[300px]">
      {jds.map((jd) => (
        <Card 
          key={jd.id}
          className={cn(
            "cursor-pointer transition-all hover:border-indigo-300 dark:hover:border-indigo-700",
            selectedId === jd.id 
              ? "border-2 border-indigo-500 bg-indigo-50/30 dark:border-indigo-500 dark:bg-indigo-900/20" 
              : "border border-zinc-200 dark:border-zinc-800"
          )}
          onClick={() => onSelect(jd.id)}
        >
          <CardContent className="flex items-center justify-between gap-3 p-4">
            <div className="flex min-w-0 items-center space-x-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                <Briefcase className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">{jd.title}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {jd.company}
                </p>
              </div>
            </div>
            {selectedId === jd.id && (
              <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
