import axiosInstance from "./axiosInstance";
import { API_ENDPOINTS } from "../constants/api";

/**
 * Authentication API calls.
 */

export async function login(credentials) {
  const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  return response.data;
}

export async function register(userData) {
  const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  return response.data;
}

export async function logout() {
  const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
  return response.data;
}

export async function getMe() {
  const response = await axiosInstance.get(API_ENDPOINTS.AUTH.ME);
  return response.data;
}
