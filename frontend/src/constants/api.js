/**
 * API endpoint constants.
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN:    "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT:   "/auth/logout",
    ME:       "/auth/me",
    REFRESH:  "/auth/refresh",
  },
  USERS: {
    BASE:   "/users",
    BY_ID:  (id) => `/users/${id}`,
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
  },
};
