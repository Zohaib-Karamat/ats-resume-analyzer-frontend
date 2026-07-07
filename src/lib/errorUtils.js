/**
 * Centralized helpers for turning raw axios/API errors into clean,
 * user-facing messages (and, where possible, field-level form errors).
 *
 * Expected backend error envelope:
 * { statusCode, data: null, success: false, message: string, errors: [] }
 * `errors` may be an array of strings, or objects like
 * { field, message } / { param, msg } / { path, message }.
 */

const DEFAULT_MESSAGES_BY_STATUS = {
  400: "That request wasn't valid. Please check your input and try again.",
  401: "You're not authorized. Please log in again.",
  403: "You don't have permission to do that.",
  404: "We couldn't find what you were looking for.",
  409: "That conflicts with existing data.",
  422: "Some fields need your attention. Please review and try again.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "Something went wrong on our end. Please try again shortly.",
  502: "The server is temporarily unavailable. Please try again shortly.",
  503: "The service is temporarily unavailable. Please try again shortly.",
  504: "The server took too long to respond. Please try again.",
};

function normalizeFieldErrors(errors) {
  if (!Array.isArray(errors)) return [];

  return errors
    .map((err) => {
      if (typeof err === "string") return { field: null, message: err };
      if (err && typeof err === "object") {
        const field = err.field || err.param || err.path || err.name || null;
        const message = err.message || err.msg || null;
        return message ? { field, message } : null;
      }
      return null;
    })
    .filter(Boolean);
}

/**
 * Normalizes any error into a consistent, display-ready shape.
 */
export function parseApiError(error) {
  // No response at all: network failure, CORS issue, timeout, server down, etc.
  if (!error?.response) {
    const isTimeout = error?.code === "ECONNABORTED";
    return {
      status: null,
      isNetworkError: true,
      message: isTimeout
        ? "The request timed out. Please try again."
        : "Unable to reach the server. Please check your connection.",
      fieldErrors: [],
    };
  }

  const { status, data } = error.response;
  const fieldErrors = normalizeFieldErrors(data?.errors);
  const message =
    data?.message ||
    fieldErrors[0]?.message ||
    DEFAULT_MESSAGES_BY_STATUS[status] ||
    "An unexpected error occurred. Please try again.";

  return { status, isNetworkError: false, message, fieldErrors };
}

/**
 * Applies backend field-level validation errors to a react-hook-form
 * `setError` function. Returns the field errors that were applied so the
 * caller can decide whether a fallback toast is still needed.
 *
 * @param {unknown} error - The caught axios error.
 * @param {Function} setError - react-hook-form's `setError`.
 * @param {Record<string, string>} [fieldMap] - Optional map of
 *   backend field name -> form field name, for forms whose field names
 *   differ from the API's (e.g. `confirmNewPassword` -> `confirmPassword`).
 */
export function applyServerFieldErrors(error, setError, fieldMap = {}) {
  const { fieldErrors } = parseApiError(error);
  const applied = fieldErrors.filter((fieldError) => fieldError.field);

  applied.forEach(({ field, message }) => {
    const formField = fieldMap[field] || field;
    setError(formField, { type: "server", message });
  });

  return applied;
}
