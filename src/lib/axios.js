import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../features/auth/store/authStore";
import { parseApiError } from "./errorUtils";
import { logApiError } from "./logger";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  timeout: 30000,
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
      useAuthStore.getState().logout();
      // Only redirect if we're not already on the login page to avoid loops
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      toast.error("Your session has expired. Please log in again.");
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default api;
