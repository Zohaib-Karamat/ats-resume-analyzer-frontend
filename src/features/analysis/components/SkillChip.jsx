import { cn } from "../../../lib/utils";

export function SkillChip({ skill, variant = "matched" }) {
  const isMatched = variant === "matched";
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
        isMatched
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
          : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"
      )}
    >
      {skill}
    </span>
  );
}
