import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

/**
 * QueryErrorState — displayed by TanStack Query when a query fails.
 * Drop this inside any component that calls useQuery.
 * Usage: if (isError) return <QueryErrorState onRetry={refetch} />;
 */
export function QueryErrorState({ onRetry, message, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-rose-200 bg-rose-50/50 p-10 text-center dark:border-rose-800/50 dark:bg-rose-950/20",
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="rounded-full bg-rose-100 p-3 dark:bg-rose-900/40">
        <AlertCircle className="h-6 w-6 text-rose-600 dark:text-rose-400" aria-hidden="true" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-rose-900 dark:text-rose-100">
        Failed to load data
      </h3>
      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
        {message || "An error occurred while fetching. Please try again."}
      </p>
      {onRetry && (
        <Button
          variant="destructive"
          size="sm"
          className="mt-4 bg-rose-600 hover:bg-rose-500"
          onClick={onRetry}
        >
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          Retry
        </Button>
      )}
    </div>
  );
}

/**
 * EmptyState — shown when a query succeeds but returns no data.
 */
export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 p-10 text-center dark:border-zinc-800 dark:bg-zinc-900/30",
        className
      )}
    >
      {Icon && (
        <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
          <Icon className="h-6 w-6 text-zinc-400" aria-hidden="true" />
        </div>
      )}
      {title && (
        <h3 className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
      )}
      {description && (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
