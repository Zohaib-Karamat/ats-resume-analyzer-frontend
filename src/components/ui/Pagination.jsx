import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";
import { IconButton } from "./IconButton";

export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-zinc-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-zinc-800">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            Showing page <span className="font-medium text-zinc-950 dark:text-zinc-50">{currentPage}</span> of <span className="font-medium text-zinc-950 dark:text-zinc-50">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <IconButton
              variant="ghost"
              className="rounded-l-md rounded-r-none border border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </IconButton>
            
            {/* Logic for showing numbers could go here, keeping simple for now */}
            <div className="flex items-center border-y border-zinc-300 px-4 text-sm font-semibold text-zinc-900 dark:border-zinc-700 dark:text-zinc-100">
              {currentPage}
            </div>

            <IconButton
              variant="ghost"
              className="rounded-l-none rounded-r-md border border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </IconButton>
          </nav>
        </div>
      </div>
    </div>
  );
}
