import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      sessionExpiredShown: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: !!token, sessionExpiredShown: false }),
      setUser: (user) => set({ user }),
      setSessionExpiredShown: (shown) => set({ sessionExpiredShown: shown }),
      logout: () => set({ user: null, token: null, isAuthenticated: false, sessionExpiredShown: false }),
    }),
    {
      name: "auth-storage", // key in localStorage
    },
  ),
);
