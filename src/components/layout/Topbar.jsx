import { useEffect, useRef, useState } from "react";
import { Menu, Moon, Sun, User, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "../ui/IconButton";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { useLogout } from "../../features/auth/hooks/useLogout";

export function Topbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const logoutMutation = useLogout();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    try {
      await logoutMutation.mutateAsync();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center gap-x-3 border-b border-zinc-200 bg-white px-3 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 dark:border-zinc-800 dark:bg-zinc-950">
      <IconButton
        variant="ghost"
        className="-m-2.5 p-2.5 text-zinc-700 lg:hidden dark:text-zinc-300"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </IconButton>

      {/* Separator for mobile */}
      <div
        className="h-6 w-px bg-zinc-200 lg:hidden dark:bg-zinc-800"
        aria-hidden="true"
      />

      <div className="flex min-w-0 flex-1 gap-x-3 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex min-w-0 items-center gap-x-2 sm:gap-x-4 lg:gap-x-6">
          <IconButton variant="ghost" onClick={toggleTheme}>
            <span className="sr-only">Toggle theme</span>
            {theme === "dark" ? (
              <Sun className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5" aria-hidden="true" />
            )}
          </IconButton>

          {/* Separator */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-zinc-200 dark:lg:bg-zinc-800"
            aria-hidden="true"
          />

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <IconButton
              variant="ghost"
              className="-m-1.5 flex items-center p-1.5"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-haspopup="true"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open user menu</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                <User className="h-5 w-5" />
              </div>
            </IconButton>

            {isMenuOpen && (
              <div className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
                  <p className="truncate text-sm font-medium text-zinc-950 dark:text-zinc-50">
                    {user?.name || "User"}
                  </p>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {user?.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <Settings className="h-4 w-4" aria-hidden="true" />
                  Account settings
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-rose-600 hover:bg-zinc-100 disabled:opacity-50 dark:text-rose-400 dark:hover:bg-zinc-800"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  {logoutMutation.isPending ? "Signing out..." : "Sign out"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
