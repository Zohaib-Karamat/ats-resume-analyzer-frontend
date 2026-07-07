import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCurrentUser } from "../../features/auth/hooks/useCurrentUser";
import { Spinner } from "../ui/Spinner";

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  // Validates the persisted token against the backend on first load. Invalid
  // tokens are handled globally by the axios 401 interceptor (auto-logout).
  const { isLoading } = useCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner className="h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return <Outlet />;
}
