import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/features/auth/api/authApi";

export default function DashboardPage() {
  const { user, clearAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // clears the cookie + revokes server-side
    } finally {
      clearAuth(); // drop the in-memory token either way
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-muted">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {user && <p className="text-muted-foreground">Signed in as {user.email}</p>}
      <Button variant="outline" onClick={handleLogout}>
        Log out
      </Button>
    </div>
  );
}
