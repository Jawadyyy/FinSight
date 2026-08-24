import axios from "axios";

/**
 * Where the API lives.
 *
 * Empty in development, so calls stay relative ('/auth/login') and the Vite
 * proxy forwards them to localhost:3000 — same-origin to the browser, which is
 * what lets the refresh cookie work locally. In production there is no proxy,
 * so this is set to the deployed API's origin at build time.
 */
export const API_BASE = import.meta.env.VITE_API_URL ?? "";

// One shared HTTP client for the whole app.
export const api = axios.create({
  baseURL: `${API_BASE}/auth`,
  withCredentials: true,  // send & receive the httpOnly refresh cookie
});

// --- Automatic token refresh ---------------------------------------------
// The access token lives 15 minutes. When a request comes back 401, we trade
// the refresh cookie for a new one and replay the original request, so the
// user never notices the token expiring.

/**
 * The single in-flight refresh, shared by every caller.
 *
 * Refresh tokens are single-use: the server rotates them, so the old cookie is
 * rejected the moment a new one is issued. Two callers refreshing in parallel
 * would therefore race, and the loser would see a 401 and treat the session as
 * over. Everyone awaiting the same promise means exactly one rotation happens.
 */
let inFlight: Promise<string> | null = null;

export function refreshSession(): Promise<string> {
  inFlight ??= api
    .post<{ accessToken: string }>("/refresh")
    .then((response) => {
      const token = response.data.accessToken;
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      return token;
    })
    .finally(() => {
      // Cleared so a later expiry can start a fresh one.
      inFlight = null;
    });

  return inFlight;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const url: string = original?.url ?? "";

    // Never try to refresh the auth calls themselves (avoids an infinite loop).
    const isAuthCall =
      url.includes("/refresh") || url.includes("/login") || url.includes("/register");

    if (status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        const token = await refreshSession();
        original.headers.Authorization = `Bearer ${token}`;
        return api(original); // replay the original request
      } catch {
        // fall through to reject
      }
    }

    return Promise.reject(error);
  },
);
