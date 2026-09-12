import { Outlet, Link } from "react-router-dom";
import { PageTransition } from "./PageTransition";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center mesh-bg p-4">
      <Link to="/" className="mb-10 transition-transform hover:scale-105">
        <span className="animate-text-gradient bg-gradient-to-r from-blue-800 via-blue-500 to-blue-800 bg-clip-text text-5xl font-black tracking-tight text-transparent dark:from-blue-500 dark:via-blue-300 dark:to-blue-500 drop-shadow-sm">
          ATS Analyzer
        </span>
      </Link>
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </div>
    </div>
  );
}
