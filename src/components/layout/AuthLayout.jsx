import { Outlet } from "react-router-dom";
import { PageTransition } from "./PageTransition";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-md">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </div>
    </div>
  );
}
