import { Sparkles } from "lucide-react";

export function AISummaryCard({ summary }) {
  return (
    <div className="relative flex min-h-[220px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-sm">
      <div className="relative flex h-full w-full flex-col justify-center rounded-xl bg-white p-6 dark:bg-zinc-950">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl" />
        
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-semibold tracking-wide text-indigo-900 uppercase dark:text-indigo-300">
            AI Executive Summary
          </h3>
        </div>
        
        <p className="relative z-10 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {summary}
        </p>
      </div>
    </div>
  );
}
