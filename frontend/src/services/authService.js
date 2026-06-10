import axiosInstance from "./axiosInstance";
import { API_ENDPOINTS } from "../constants/api";

/**
 * Auth API service layer.
 * All functions return response.data directly.
 */

// POST /api/auth/register
export async function registerUser(userData) {
  const res = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  return res.data;
}

// POST /api/auth/verify-register-otp
export async function verifyRegisterOtp(payload) {
  const res = await axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY_REGISTER_OTP, payload);
  return res.data;
}

// POST /api/auth/login
export async function loginUser(credentials) {
  const res = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  return res.data;
}

// POST /api/auth/verify-login-otp
export async function verifyLoginOtp(payload) {
  const res = await axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY_LOGIN_OTP, payload);
  return res.data;
}

// GET /api/auth/profile  (requires JWT — Axios interceptor adds it)
export async function getProfile() {
  const res = await axiosInstance.get(API_ENDPOINTS.AUTH.PROFILE);
  return res.data;
}

// Backward compat aliases used by old AuthContext
export const login    = loginUser;
export const register = registerUser;
export const getMe    = getProfile;
export async function logout() { return { success: true }; } // no server logout endpoint
