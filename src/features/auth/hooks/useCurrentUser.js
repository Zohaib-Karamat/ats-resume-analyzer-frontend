import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

/**
 * Fetches the authenticated user's profile from the backend (GET /auth/me).
 *
 * Used to validate the persisted token on app load and to keep the locally
 * cached user in sync with the backend. Automatically disabled when there's
 * no token. Invalid/expired tokens are handled globally by the axios 401
 * interceptor (auto-logout + redirect to /login).
 */
export function useCurrentUser() {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);

  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.getMe,
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data.user ?? query.data);
    }
  }, [query.data, setUser]);

  return query;
}
