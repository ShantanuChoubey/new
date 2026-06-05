import axios from "axios";
import toast from "react-hot-toast";
import { TOKEN_KEY } from "../constants/app";
import { getItem, removeItem } from "../utils/storage";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Request interceptor ────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ───────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error?.response?.status;
    const message = error?.response?.data?.message ?? error.message;

    if (status === 401) {
      removeItem(TOKEN_KEY);
      // Redirect to login without a hard reload where possible
      if (window.location.pathname !== "/login") {
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login";
      }
    } else if (status === 403) {
      toast.error("You do not have permission to perform this action.");
    } else if (status === 404) {
      toast.error("The requested resource was not found.");
    } else if (status >= 500) {
      toast.error("A server error occurred. Please try again later.");
    } else if (message) {
      // Let individual callers decide whether to show the message,
      // but provide a fallback for truly unhandled cases.
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
