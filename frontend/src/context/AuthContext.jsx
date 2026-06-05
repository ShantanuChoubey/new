import { createContext, useContext, useEffect, useReducer, useCallback } from "react";
import toast from "react-hot-toast";
import { login, logout, register, getMe } from "../services/authService";
import { TOKEN_KEY, USER_KEY } from "../constants/app";
import { getItem, setItem, removeItem } from "../utils/storage";

// ── State shape ────────────────────────────────────────────────
const initialState = {
  user:          getItem(USER_KEY),
  token:         getItem(TOKEN_KEY),
  isLoading:     false,
  isInitializing: true,
  error:         null,
};

// ── Reducer ────────────────────────────────────────────────────
function authReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload, error: null };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "SET_USER":
      return { ...state, user: action.payload, isLoading: false, error: null };
    case "SET_TOKEN":
      return { ...state, token: action.payload };
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

  // Validate stored token on mount
  useEffect(() => {
    async function init() {
      if (state.token) {
        try {
          const data = await getMe();
          dispatch({ type: "SET_USER", payload: data.user ?? data });
          setItem(USER_KEY, data.user ?? data);
        } catch {
          removeItem(TOKEN_KEY);
          removeItem(USER_KEY);
          dispatch({ type: "LOGOUT" });
        }
      }
      dispatch({ type: "INITIALIZED" });
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginUser = useCallback(async (credentials) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const data = await login(credentials);
      setItem(TOKEN_KEY, data.token);
      setItem(USER_KEY, data.user);
      dispatch({ type: "SET_TOKEN", payload: data.token });
      dispatch({ type: "SET_USER",  payload: data.user });
      toast.success(`Welcome back, ${data.user?.name ?? "User"}!`);
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message ?? "Login failed.";
      dispatch({ type: "SET_ERROR", payload: message });
      toast.error(message);
      return { success: false, message };
    }
  }, []);

  const registerUser = useCallback(async (userData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const data = await register(userData);
      setItem(TOKEN_KEY, data.token);
      setItem(USER_KEY, data.user);
      dispatch({ type: "SET_TOKEN", payload: data.token });
      dispatch({ type: "SET_USER",  payload: data.user });
      toast.success("Account created successfully!");
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message ?? "Registration failed.";
      dispatch({ type: "SET_ERROR", payload: message });
      toast.error(message);
      return { success: false, message };
    }
  }, []);

  const logoutUser = useCallback(async () => {
    try {
      await logout();
    } catch {
      // ignore server errors on logout
    } finally {
      removeItem(TOKEN_KEY);
      removeItem(USER_KEY);
      dispatch({ type: "LOGOUT" });
      toast.success("Logged out successfully.");
    }
  }, []);

  const value = {
    ...state,
    isAuthenticated: !!state.token && !!state.user,
    loginUser,
    registerUser,
    logoutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ───────────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
