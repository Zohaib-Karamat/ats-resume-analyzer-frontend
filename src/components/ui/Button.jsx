import { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { Spinner } from "./Spinner";

const variants = {
  primary: "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:from-indigo-400 hover:to-blue-500 focus-visible:ring-indigo-500 border border-transparent",
  secondary: "bg-white/80 backdrop-blur-sm text-zinc-900 border border-zinc-200/50 shadow-sm hover:bg-zinc-50 focus-visible:ring-zinc-500 dark:bg-zinc-800/80 dark:border-zinc-700/50 dark:text-zinc-50 dark:hover:bg-zinc-700/80",
  ghost: "bg-transparent text-zinc-700 hover:bg-zinc-100/50 dark:text-zinc-300 dark:hover:bg-zinc-800/50",
  destructive: "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md hover:shadow-lg hover:from-rose-400 hover:to-red-500 focus-visible:ring-rose-500",
};

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 py-2",
  lg: "h-12 px-8 text-lg",
};

export const Button = forwardRef(({
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  disabled,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={isLoading || disabled}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-offset-zinc-950",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading && <Spinner className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
});

Button.displayName = "Button";
