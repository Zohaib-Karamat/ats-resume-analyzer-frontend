import { parseApiError } from "./errorUtils";

const isDev = import.meta.env.DEV;

/**
 * Logs a clean, grouped summary of an API error to the console instead of
 * dumping the raw axios error object. Only runs in development.
 */
export function logApiError(error) {
  if (!isDev) return;

  const { status, message, isNetworkError } = parseApiError(error);
  const method = error?.config?.method?.toUpperCase() || "REQUEST";
  const url = error?.config?.url || "unknown endpoint";
  const label = isNetworkError ? "NETWORK" : status;

  console.groupCollapsed(
    `%c[API Error] ${method} ${url} → ${label}`,
    "color:#e11d48;font-weight:600;",
  );
  console.error(message);
  if (error?.response?.data) {
    console.debug("Response body:", error.response.data);
  }
  console.debug("Raw error:", error);
  console.groupEnd();
}
