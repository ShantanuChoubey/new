/**
 * API endpoint constants.
 */
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER:            "/auth/register",
    VERIFY_REGISTER_OTP: "/auth/verify-register-otp",
    LOGIN:               "/auth/login",
    VERIFY_LOGIN_OTP:    "/auth/verify-login-otp",
    PROFILE:             "/auth/profile",
    // kept for backward compat
    LOGOUT:   "/auth/logout",
    ME:       "/auth/profile",
    REFRESH:  "/auth/refresh",
  },
  USERS: {
    BASE:   "/users",
    BY_ID:  (id) => `/users/${id}`,
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
  },
};
