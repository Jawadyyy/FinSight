import axios from "axios";

// One shared HTTP client for the whole app.
export const api = axios.create({
  baseURL: "/auth",       // '/auth/login' etc. — forwarded to :3000 by the Vite proxy
  withCredentials: true,  // send & receive the httpOnly refresh cookie
});

// --- Automatic token refresh ---------------------------------------------
// The access token lives 15 minutes. When a request comes back 401, we try the
// refresh cookie once, update the token, and replay the original request — so
// the user never notices the token expiring. If refresh itself fails, we give
// up and let the 401 bubble (ProtectedRoute / the caller handles it).
let refreshing: Promise<string> | null = null;

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
        // Share one in-flight refresh across concurrent 401s.
        refreshing =
          refreshing ??
          api
            .post<{ accessToken: string }>("/refresh")
            .then((r) => r.data.accessToken)
            .finally(() => {
              refreshing = null;
            });

        const token = await refreshing;
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        original.headers.Authorization = `Bearer ${token}`;
        return api(original); // replay the original request
      } catch {
        // fall through to reject
      }
    }

    return Promise.reject(error);
  },
);
