import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

// Wrap any route that needs a logged-in user.
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  // Wait for the on-load refresh check before deciding — otherwise a reload
  // would flash to /login before the cookie is even tried.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
