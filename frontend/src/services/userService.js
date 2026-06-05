import axiosInstance from "./axiosInstance";
import { API_ENDPOINTS } from "../constants/api";

/**
 * User resource API calls.
 */

export async function getUsers(params = {}) {
  const response = await axiosInstance.get(API_ENDPOINTS.USERS.BASE, { params });
  return response.data;
}

export async function getUserById(id) {
  const response = await axiosInstance.get(API_ENDPOINTS.USERS.BY_ID(id));
  return response.data;
}

export async function updateUser(id, data) {
  const response = await axiosInstance.put(API_ENDPOINTS.USERS.UPDATE(id), data);
  return response.data;
}

export async function deleteUser(id) {
  const response = await axiosInstance.delete(API_ENDPOINTS.USERS.DELETE(id));
  return response.data;
}
