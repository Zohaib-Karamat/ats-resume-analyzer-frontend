import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Input = forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-[var(--radius-md)] border border-zinc-200/80 bg-white/50 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 focus-visible:bg-white focus-visible:shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800/80 dark:bg-zinc-950/50 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:text-white dark:focus-visible:bg-zinc-950",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";
