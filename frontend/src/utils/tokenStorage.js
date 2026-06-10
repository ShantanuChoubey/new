import { TOKEN_KEY, USER_KEY } from "../constants/app";

/**
 * Token and user data helpers — thin wrappers over localStorage.
 * Use these instead of accessing localStorage directly in components.
 */

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
}

export function getToken() {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function removeUser() {
  localStorage.removeItem(USER_KEY);
}

export function clearAuth() {
  removeToken();
  removeUser();
}
