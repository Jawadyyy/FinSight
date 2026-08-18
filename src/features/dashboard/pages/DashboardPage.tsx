import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftRight,
  LogOut,
  PiggyBank,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/features/auth/api/authApi";
import TransactionsPage from "@/features/transactions/pages/TransactionsPage";
import BudgetsPage from "@/features/budgets/pages/BudgetsPage";

type Page = "transactions" | "budgets";

const navItems: { key: Page; label: string; icon: typeof Wallet }[] = [
  { key: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { key: "budgets", label: "Budgets", icon: PiggyBank },
];

export default function DashboardPage() {
  const { user, clearAuth } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState<Page>("transactions");

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearAuth();
      navigate("/login");
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <Wallet className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold">FinSight</span>
          </div>
        </SidebarHeader>
        <Separator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      isActive={page === item.key}
                      onClick={() => setPage(item.key)}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="px-2 py-1 text-xs text-muted-foreground truncate">
                {user?.email}
              </div>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut />
                <span>Log out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <h2 className="text-sm font-medium">
            {navItems.find((i) => i.key === page)?.label}
          </h2>
        </header>
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-5xl">
            {page === "transactions" && <TransactionsPage />}
            {page === "budgets" && <BudgetsPage />}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
