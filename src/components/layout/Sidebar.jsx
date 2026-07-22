import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Sparkles,
  History,
  User,
  Mail,
} from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Resumes", href: "/resumes", icon: FileText },
  { name: "Job Descriptions", href: "/job-descriptions", icon: Briefcase },
  { name: "Cover Letters", href: "/cover-letters", icon: Mail },
  { name: "AI Analysis", href: "/analysis", icon: Sparkles },
  { name: "History", href: "/history", icon: History },
  { name: "Profile", href: "/profile", icon: User },
];

export function Sidebar({ className }) {
  return (
    <div
      className={cn(
        "flex h-full w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950",
        className,
      )}
    >
      <div className="flex h-20 items-center px-6">
        <Link to="/" className="cursor-pointer transition-opacity hover:opacity-80">
          <span className="animate-text-gradient bg-gradient-to-r from-blue-800 via-blue-500 to-blue-800 bg-clip-text text-2xl font-black tracking-tight text-transparent dark:from-blue-500 dark:via-blue-300 dark:to-blue-500">
            ATS Analyzer
          </span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/50",
                )
              }
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
