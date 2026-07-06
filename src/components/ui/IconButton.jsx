import { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { Spinner } from "./Spinner";

const variants = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-600",
  secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus-visible:ring-zinc-500 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700",
  ghost: "bg-transparent text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800",
  destructive: "bg-rose-500 text-white hover:bg-rose-600 focus-visible:ring-rose-500",
};

const sizes = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export const IconButton = forwardRef(({ 
  className, 
  variant = "ghost", 
  size = "md", 
  isLoading = false, 
  children, 
  disabled,
  "aria-label": ariaLabel,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      disabled={isLoading || disabled}
      aria-label={ariaLabel}
      aria-busy={isLoading}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-offset-zinc-950",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? <Spinner className="h-4 w-4" /> : children}
    </button>
  );
});

IconButton.displayName = "IconButton";
