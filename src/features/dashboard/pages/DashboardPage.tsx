import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/features/auth/api/authApi";
import TransactionsPage from "@/features/transactions/pages/TransactionsPage";

export default function DashboardPage() {
  const { user, clearAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearAuth();
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="flex items-center justify-between border-b bg-background px-6 py-3">
        <h1 className="text-xl font-bold">FinSight</h1>
        <div className="flex items-center gap-4">
          {user && <span className="text-sm text-muted-foreground">{user.email}</span>}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-6">
        <TransactionsPage />
      </main>
    </div>
  );
}
