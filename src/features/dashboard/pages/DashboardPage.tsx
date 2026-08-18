import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/features/auth/api/authApi";
import TransactionsPage from "@/features/transactions/pages/TransactionsPage";
import BudgetsPage from "@/features/budgets/pages/BudgetsPage";

type Tab = "transactions" | "budgets";

export default function DashboardPage() {
  const { user, clearAuth } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("transactions");

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearAuth();
      navigate("/login");
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "transactions", label: "Transactions" },
    { key: "budgets", label: "Budgets" },
  ];

  return (
    <div className="min-h-screen bg-muted">
      <header className="border-b bg-background">
        <div className="flex items-center justify-between px-6 py-3">
          <h1 className="text-xl font-bold">FinSight</h1>
          <div className="flex items-center gap-4">
            {user && <span className="text-sm text-muted-foreground">{user.email}</span>}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
        <nav className="flex gap-4 px-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl p-6">
        {tab === "transactions" && <TransactionsPage />}
        {tab === "budgets" && <BudgetsPage />}
      </main>
    </div>
  );
}
