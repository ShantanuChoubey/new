import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";
import { DATE_FORMATS } from "../constants/app";

/**
 * Safely parse a date value (string | Date | number).
 */
function toDate(value) {
  if (!value) return null;
  const d = typeof value === "string" ? parseISO(value) : new Date(value);
  return isValid(d) ? d : null;
}

/**
 * Format a date using a pattern from DATE_FORMATS or a custom string.
 * Returns an empty string when the date is invalid.
 */
export function formatDate(value, pattern = DATE_FORMATS.DISPLAY) {
  const d = toDate(value);
  if (!d) return "";
  return format(d, pattern);
}

/**
 * Returns a relative string like "3 days ago".
 */
export function timeAgo(value) {
  const d = toDate(value);
  if (!d) return "";
  return formatDistanceToNow(d, { addSuffix: true });
}
