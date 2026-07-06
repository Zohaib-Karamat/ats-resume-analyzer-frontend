import { Menu, Moon, Sun, User } from "lucide-react";
import { IconButton } from "../ui/IconButton";
import { useTheme } from "../../hooks/useTheme";

export function Topbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center gap-x-4 border-b border-zinc-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 dark:border-zinc-800 dark:bg-zinc-950">
      <IconButton
        variant="ghost"
        className="-m-2.5 p-2.5 text-zinc-700 lg:hidden dark:text-zinc-300"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </IconButton>

      {/* Separator for mobile */}
      <div className="h-6 w-px bg-zinc-200 lg:hidden dark:bg-zinc-800" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <IconButton variant="ghost" onClick={toggleTheme}>
            <span className="sr-only">Toggle theme</span>
            {theme === "dark" ? (
              <Sun className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5" aria-hidden="true" />
            )}
          </IconButton>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-zinc-200 dark:lg:bg-zinc-800" aria-hidden="true" />

          {/* User Menu Placeholder */}
          <div className="relative">
            <IconButton variant="ghost" className="-m-1.5 flex items-center p-1.5">
              <span className="sr-only">Open user menu</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                <User className="h-5 w-5" />
              </div>
            </IconButton>
          </div>
        </div>
      </div>
    </header>
  );
}
