import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api, refreshSession } from "@/lib/api";
import { me } from "@/features/auth/api/authApi";
import type { AuthResponse, User } from "@/types/auth";

interface AuthValue {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean; // true while we check the refresh cookie on first load
  setAuth: (data: AuthResponse) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

/**
 * A hint that this browser had a session, so the on-load refresh is worth
 * trying. It is NOT a credential — the real refresh token is the httpOnly
 * cookie, which the server still validates. Its only job is to let a
 * never-logged-in visitor skip the refresh round trip and go straight to the
 * login screen, instead of flashing a "Loading…" while a doomed /refresh
 * call resolves.
 */
const SESSION_HINT = 'finsight.hadSession';

// Attaching the token to axios in one place keeps set/clear symmetric.
function attachToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Call after a successful login / register / Google callback.
  const setAuth = (data: AuthResponse) => {
    setUser(data.user);
    setAccessToken(data.accessToken);
    attachToken(data.accessToken);
    localStorage.setItem(SESSION_HINT, '1');
  };

  // Call on logout.
  const clearAuth = () => {
    setUser(null);
    setAccessToken(null);
    attachToken(null);
    localStorage.removeItem(SESSION_HINT);
  };

  // On first load the access token (memory-only) is gone, but the refresh
  // cookie may still be valid. Try to trade it for a new access token so a
  // page reload does not log the user out.
  useEffect(() => {
    // Never signed in on this browser: skip the /refresh round trip entirely
    // and resolve straight to "logged out". This is what removes the brief
    // "Loading…" flash before the redirect to /login.
    if (!localStorage.getItem(SESSION_HINT)) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        // refreshSession is shared and de-duplicated. That matters here because
        // React StrictMode runs this effect twice in development, and refresh
        // tokens are single-use — two independent calls would race, the loser
        // would get a 401, and its catch would clear the session the winner
        // had just restored. Which looked exactly like "reloading logs me out".
        const token = await refreshSession();
        const currentUser = await me();
        setAccessToken(token);
        setUser(currentUser);
      } catch {
        // The hint was stale (cookie expired/revoked). Clear it so the next
        // load skips the doomed refresh.
        clearAuth();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!accessToken,
        loading,
        setAuth,
        clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Small hook so components do `const { user } = useAuth()`.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
