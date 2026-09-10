import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../features/auth/store/authStore";
import { parseApiError } from "./errorUtils";
import { logApiError } from "./logger";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Default timeout for regular requests (auth, CRUD, etc.)
const DEFAULT_TIMEOUT = 30_000;

// Extended timeout for AI-driven endpoints that call Gemini
export const AI_TIMEOUT = 120_000; // 2 minutes

const api = axios.create({
  baseURL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Read token directly from Zustand store
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // AI endpoints need a longer timeout — apply it automatically
    const AI_ENDPOINTS = ["/analysis", "/cover-letters/generate"];
    const isAiEndpoint = AI_ENDPOINTS.some(
      (endpoint) =>
        config.url?.includes(endpoint) && config.method?.toLowerCase() === "post"
    );
    if (isAiEndpoint) {
      config.timeout = AI_TIMEOUT;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Requests to these endpoints are expected to fail with 401 for reasons
// unrelated to an expired session (e.g. wrong credentials on login, or a
// wrong current password on change-password), so we don't want the global
// auto-logout/redirect behavior kicking in for them.
const NON_SESSION_401_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/verify-email",
  "/auth/resend-verification-otp",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/change-password",
  "/auth/logout",
];

// Response Interceptor — the single place responsible for turning API
// errors into a polished toast + a clean console log. Individual
// pages/hooks can still inspect the error themselves (e.g. to show
// field-level validation messages) without needing to show their own toast.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    logApiError(error);

    const { status, message } = parseApiError(error);
    const requestUrl = error.config?.url || "";
    const isNonSessionEndpoint = NON_SESSION_401_ENDPOINTS.some((endpoint) =>
      requestUrl.includes(endpoint),
    );

    if (status === 401 && !isNonSessionEndpoint) {
      // Auto-logout on 401 Unauthorized (expired/invalid session token)
      const authStore = useAuthStore.getState();
      
      // Only show the expiration message if they actually had a session token
      // This prevents stray background queries/retries from showing the error
      // after the user has already logged out or on first load.
      if (authStore.token) {
        if (!authStore.sessionExpiredShown) {
          authStore.setSessionExpiredShown(true);
          toast.error("Your session has expired. Please log in again.", {
            id: "session-expired",
          });
        }
        
        authStore.logout();
        // Only redirect if we're not already on the login page to avoid loops
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default api;
