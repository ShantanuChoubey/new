import { createContext, useContext, useEffect, useReducer, useCallback } from "react";
import toast from "react-hot-toast";
import {
  registerUser,
  verifyRegisterOtp,
  loginUser,
  verifyLoginOtp,
  getProfile,
} from "../services/authService";
import { saveToken, saveUser, clearAuth, getToken, getUser } from "../utils/tokenStorage";

// ── Initial state ──────────────────────────────────────────────
const initialState = {
  user:           getUser(),
  token:          getToken(),
  isLoading:      false,
  isInitializing: true,
  error:          null,
};

// ── Reducer ────────────────────────────────────────────────────
function authReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload, error: null };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "AUTH_SUCCESS":
      return {
        ...state,
        token:     action.payload.token,
        user:      action.payload.user,
        isLoading: false,
        error:     null,
      };
    case "INITIALIZED":
      return { ...state, isInitializing: false };
    case "LOGOUT":
      return { ...initialState, isInitializing: false, user: null, token: null };
    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On mount: validate stored token by calling profile API
  useEffect(() => {
    async function init() {
      const token = getToken();
      if (token) {
        try {
          const data = await getProfile();
          const user = data?.data?.user ?? data;
          dispatch({ type: "AUTH_SUCCESS", payload: { token, user } });
          saveUser(user);
        } catch {
          clearAuth();
          dispatch({ type: "LOGOUT" });
        }
      }
      dispatch({ type: "INITIALIZED" });
    }
    init();
  }, []); // eslint-disable-line

  // ── Step 1: Register (sends OTP, no token yet) ─────────────
  const handleRegister = useCallback(async (userData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const data = await registerUser(userData);
      dispatch({ type: "SET_LOADING", payload: false });
      toast.success(data.message || "OTP sent to your email!");
      return { success: true, email: userData.email };
    } catch (error) {
      const message = error?.response?.data?.message ?? "Registration failed.";
      dispatch({ type: "SET_ERROR", payload: message });
      toast.error(message);
      return { success: false, message };
    }
  }, []);

  // ── Step 2: Verify Register OTP (returns JWT) ──────────────
  const handleVerifyRegisterOtp = useCallback(async (payload) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const data = await verifyRegisterOtp(payload);
      const { token, user } = data.data;
      saveToken(token);
      saveUser(user);
      dispatch({ type: "AUTH_SUCCESS", payload: { token, user } });
      toast.success(data.message || "Email verified! Welcome 🎉");
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message ?? "OTP verification failed.";
      dispatch({ type: "SET_ERROR", payload: message });
      toast.error(message);
      return { success: false, message };
    }
  }, []);

  // ── Step 3: Login (sends OTP, no token yet) ────────────────
  const handleLogin = useCallback(async (credentials) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const data = await loginUser(credentials);
      dispatch({ type: "SET_LOADING", payload: false });
      toast.success(data.message || "OTP sent to your email!");
      return { success: true, email: credentials.email };
    } catch (error) {
      const message = error?.response?.data?.message ?? "Login failed.";
      dispatch({ type: "SET_ERROR", payload: message });
      toast.error(message);
      return { success: false, message };
    }
  }, []);

  // ── Step 4: Verify Login OTP (returns JWT) ─────────────────
  const handleVerifyLoginOtp = useCallback(async (payload) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const data = await verifyLoginOtp(payload);
      const { token, user } = data.data;
      saveToken(token);
      saveUser(user);
      dispatch({ type: "AUTH_SUCCESS", payload: { token, user } });
      toast.success(data.message || `Welcome back, ${user.name}!`);
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message ?? "OTP verification failed.";
      dispatch({ type: "SET_ERROR", payload: message });
      toast.error(message);
      return { success: false, message };
    }
  }, []);

  // ── Logout ─────────────────────────────────────────────────
  const handleLogout = useCallback(() => {
    clearAuth();
    dispatch({ type: "LOGOUT" });
    toast.success("Logged out successfully.");
  }, []);

  const value = {
    ...state,
    isAuthenticated:      !!state.token && !!state.user,
    // Action handlers
    handleRegister,
    handleVerifyRegisterOtp,
    handleLogin,
    handleVerifyLoginOtp,
    handleLogout,
    // Backward compat aliases
    loginUser:    handleLogin,
    registerUser: handleRegister,
    logoutUser:   handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export default AuthContext;
