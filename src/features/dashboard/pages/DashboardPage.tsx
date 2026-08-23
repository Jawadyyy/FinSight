import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftRight,
  ChartColumnBig,
  CreditCard,
  FileDown,
  House,
  LogOut,
  PiggyBank,
  Search,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
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
import AnalyticsPage from "@/features/analytics/pages/AnalyticsPage";
import OverviewPage from "@/features/overview/pages/OverviewPage";
import ReportsPage from "@/features/reports/pages/ReportsPage";
import InsightsPage from "@/features/insights/pages/InsightsPage";
import PlanPage from "@/features/subscription/pages/PlanPage";

const BRAND = "#644fef";

export type Page =
  | "home"
  | "insights"
  | "transactions"
  | "budgets"
  | "analytics"
  | "reports"
  | "plan";

const navItems: { key: Page; label: string; icon: typeof Wallet }[] = [
  { key: "home", label: "Dashboard", icon: House },
  { key: "insights", label: "Insights", icon: Sparkles },
  { key: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { key: "budgets", label: "Budgets", icon: PiggyBank },
  { key: "analytics", label: "Analytics", icon: ChartColumnBig },
  { key: "reports", label: "Reports", icon: FileDown },
  { key: "plan", label: "Plan", icon: CreditCard },
];

const PAGE_TITLE: Record<Page, string> = {
  home: "Dashboard",
  insights: "Insights",
  transactions: "Transactions",
  budgets: "Budgets",
  analytics: "Analytics",
  reports: "Reports",
  plan: "Plan",
};

export default function DashboardPage() {
  const { user, clearAuth } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState<Page>("home");

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearAuth();
      navigate("/login");
    }
  };

  const initials = (user?.name || user?.email || "?")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarHeader className="px-4 py-4">
          <div className="flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: BRAND }}
            >
              <Wallet className="h-4 w-4 text-white" />
            </span>
            <span className="font-display text-lg font-bold">FinSight</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const active = page === item.key;
                  return (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton
                        isActive={active}
                        onClick={() => setPage(item.key)}
                        tooltip={item.label}
                        className="h-10"
                        // The active item carries the brand; everything else
                        // stays quiet so the current page is unmistakable.
                        style={
                          active
                            ? { backgroundColor: BRAND, color: "#fff" }
                            : undefined
                        }
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-3">
          <Separator className="mb-2" />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} className="h-10">
                <LogOut />
                <span>Log out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-muted/40">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background px-4 sm:px-6">
          <SidebarTrigger />

          <div className="relative hidden max-w-sm flex-1 sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions, merchants, categories"
              className="h-9 pl-9"
              onFocus={() => setPage("transactions")}
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 gap-2 px-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback
                      className="text-xs font-semibold text-white"
                      style={{ backgroundColor: BRAND }}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium sm:inline">
                    {user?.name ?? user?.email?.split("@")[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
                  {user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* @container: the open sidebar takes 16rem, so the viewport is a poor
            guide to how much room the pages actually get. Anything inside can
            size itself off this column with @-prefixed variants instead. */}
        <main className="@container flex-1 p-4 sm:p-6">
          <div className="mx-auto max-w-6xl">
            <div className="sr-only" aria-live="polite">
              {PAGE_TITLE[page]}
            </div>
            {page === "home" && <OverviewPage onNavigate={setPage} />}
            {page === "insights" && <InsightsPage onNavigate={setPage} />}
            {page === "transactions" && <TransactionsPage />}
            {page === "budgets" && <BudgetsPage />}
            {page === "analytics" && <AnalyticsPage />}
            {page === "reports" && <ReportsPage />}
            {page === "plan" && <PlanPage />}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
