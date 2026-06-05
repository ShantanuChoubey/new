/**
 * General application-wide constants.
 */
export const APP_NAME    = import.meta.env.VITE_APP_NAME    ?? "MyApp";
export const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? "1.0.0";

export const TOKEN_KEY = "auth_token";
export const USER_KEY  = "auth_user";

export const PAGINATION = {
  DEFAULT_PAGE:      1,
  DEFAULT_PAGE_SIZE: 10,
};

export const DATE_FORMATS = {
  DISPLAY:   "MMM dd, yyyy",
  FULL:      "MMMM dd, yyyy 'at' h:mm a",
  SHORT:     "MM/dd/yyyy",
  ISO:       "yyyy-MM-dd",
  TIME_ONLY: "h:mm a",
};
