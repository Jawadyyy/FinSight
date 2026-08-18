import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";
import { me, refresh } from "@/features/auth/api/authApi";
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
  };

  // Call on logout.
  const clearAuth = () => {
    setUser(null);
    setAccessToken(null);
    attachToken(null);
  };

  // On first load the access token (memory-only) is gone, but the refresh
  // cookie may still be valid. Try to trade it for a new access token so a
  // page reload does not log the user out.
  useEffect(() => {
    (async () => {
      try {
        const { accessToken: token } = await refresh();
        attachToken(token);
        const currentUser = await me();
        setAccessToken(token);
        setUser(currentUser);
      } catch {
        // No valid cookie — stay logged out. This is normal for a fresh visitor.
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
