/**
 * General-purpose helper utilities.
 */

/**
 * Conditionally join class names (tiny clsx alternative).
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Truncate a string to `maxLength` characters, appending "…" if cut.
 */
export function truncate(str = "", maxLength = 80) {
  return str.length > maxLength ? `${str.slice(0, maxLength)}…` : str;
}

/**
 * Deep-clone a plain JSON-serialisable object.
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Debounce a function call.
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Check whether a value is empty (null, undefined, "", [], {}).
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

/**
 * Extract a human-readable error message from various error shapes.
 */
export function getErrorMessage(error) {
  if (!error) return "An unexpected error occurred.";
  if (typeof error === "string") return error;
  return (
    error?.response?.data?.message ??
    error?.message ??
    "An unexpected error occurred."
  );
}
