import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { me } from "../api/authApi";
import { useAuth } from "@/context/AuthContext";

// Google sends the user here as: /oauth/callback#accessToken=...
// The refresh token is already in the cookie; the access token is in the URL
// fragment. We read it, fetch the user, store both, and go to the dashboard.
export default function OAuthCallbackPage() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      // The fragment (after #) is not sent to servers — read it on the client.
      const params = new URLSearchParams(window.location.hash.slice(1));
      const token = params.get("accessToken");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        const user = await me();
        setAuth({ accessToken: token, user });
        navigate("/dashboard", { replace: true });
      } catch {
        navigate("/login", { replace: true });
      }
    })();
  }, [navigate, setAuth]);

  return (
    <div className="flex min-h-screen items-center justify-center text-muted-foreground">
      Signing you in...
    </div>
  );
}
