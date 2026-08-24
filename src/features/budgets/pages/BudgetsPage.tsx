import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TableSkeleton } from '@/components/TableSkeleton';
import { StatCard } from '@/components/StatCard';
import { CircleAlert, PiggyBank, Plus, Target, Wallet } from 'lucide-react';
import { formatMoney } from '@/lib/currency';
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../api/budgetsApi';
import BudgetCard from '../components/BudgetCard';
import BudgetDialog from '../components/BudgetDialog';
import { useCachedResource, invalidateCache } from '@/hooks/useCachedResource';
import { PaceBar } from '@/features/overview/components/PaceBar';
import type { Budget } from '@/types/budget';

const BRAND = '#644fef';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function BudgetsPage() {
  const now = new Date().toISOString().slice(0, 7);
  const [month, setMonth] = useState(now);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);

  const { data: result, loading: rawLoading, refresh } = useCachedResource(
    `budgets:${month}`,
    async () => {
      try {
        return { budgets: await getBudgets(month), error: '' };
      } catch {
        // Show nothing rather than the previous month's list under the new
        // month's heading — stale data here reads as real data.
        return { budgets: [] as Budget[], error: `Could not load budgets for ${month}.` };
      }
    },
  );

  const budgets = result?.budgets ?? [];
  const error = result?.error ?? '';
  const loading = rawLoading && !result;

  // A budget change also moves the budget-vs-actual figures on the dashboard and
  // analytics, so drop their caches to force a fresh read next time.
  const afterMutation = async () => {
    invalidateCache('overview');
    invalidateCache('analytics');
    await refresh();
  };

  const handleSubmit = async (data: { category: string; month: string; limit: number }) => {
    if (editing) {
      await updateBudget(editing.id, { limit: data.limit });
    } else {
      await createBudget(data);
    }
    setEditing(null);
    await afterMutation();
  };

  const handleEdit = (budget: Budget) => {
    setEditing(budget);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteBudget(id);
    await afterMutation();
  };

  const totalLimit = budgets.reduce((s, b) => s + Number(b.limit), 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const remaining = totalLimit - totalSpent;
  const overCount = budgets.filter((b) => b.spent > Number(b.limit)).length;

  // How far through the month we are — the bars compare against this.
  const [year, m] = month.split('-').map(Number);
  const daysInMonth = new Date(year, m, 0).getDate();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === m;
  const dayOfMonth = isCurrentMonth ? today.getDate() : daysInMonth;
  const dayFraction = dayOfMonth / daysInMonth;

  // Trouble first: a blown budget is the reason to open this page.
  const ordered = [...budgets].sort((a, b) => {
    const aOver = a.spent / Number(a.limit || 1);
    const bOver = b.spent / Number(b.limit || 1);
    return bOver - aOver;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Budgets</h2>
          <p className="text-sm text-muted-foreground">
            {MONTH_NAMES[m - 1]} {year}
            {isCurrentMonth ? ` · day ${dayOfMonth} of ${daysInMonth}` : ' · complete month'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-40"
          />
          <Button
            className="text-white"
            style={{ backgroundColor: BRAND }}
            onClick={() => { setEditing(null); setDialogOpen(true); }}
          >
            <Plus className="mr-2 h-4 w-4" /> Set budget
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <TableSkeleton rows={3} />
      ) : error ? null : budgets.length === 0 ? (
        <Card className="shadow-none">
          <CardContent className="flex flex-col items-center gap-3 py-20 text-center">
            <Target className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">No budgets for {MONTH_NAMES[m - 1]}</p>
              <p className="text-sm text-muted-foreground">
                Set a limit per category and FinSight tracks your spending
                against how far through the month you are.
              </p>
            </div>
            <Button
              className="text-white"
              style={{ backgroundColor: BRAND }}
              onClick={() => { setEditing(null); setDialogOpen(true); }}
            >
              <Plus className="mr-2 h-4 w-4" /> Set your first budget
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Budgeted"
              value={formatMoney(totalLimit)}
              icon={Target}
              accent={BRAND}
              hint={`Across ${budgets.length} categor${budgets.length === 1 ? 'y' : 'ies'}`}
            />
            <StatCard
              label="Spent"
              value={formatMoney(totalSpent)}
              icon={Wallet}
              accent="#e34948"
              hint={`${totalLimit ? Math.round((totalSpent / totalLimit) * 100) : 0}% of your budget`}
            />
            <StatCard
              label={remaining < 0 ? 'Over budget' : 'Remaining'}
              value={formatMoney(Math.abs(remaining))}
              icon={PiggyBank}
              accent={remaining < 0 ? '#e34948' : '#1baf7a'}
              hint={remaining < 0 ? 'You have gone past your limits' : 'Left to spend this month'}
            />
            <StatCard
              label="Over limit"
              value={String(overCount)}
              icon={CircleAlert}
              accent={overCount ? '#e34948' : '#888780'}
              hint={overCount ? 'Categories need attention' : 'Every category is within budget'}
            />
          </div>

          <Card className="shadow-none">
            <CardContent className="space-y-3 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">All categories</p>
                <p className="text-sm text-muted-foreground">
                  {formatMoney(totalSpent)} of {formatMoney(totalLimit)}
                </p>
              </div>
              <PaceBar spent={totalSpent} limit={totalLimit} dayFraction={dayFraction} />
              <p className="text-xs text-muted-foreground">
                The marker shows how far through {MONTH_NAMES[m - 1]} you are. A bar
                past it means you are spending faster than the month is passing.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ordered.map((b) => (
              <BudgetCard
                key={b.id}
                budget={b}
                dayFraction={dayFraction}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}

      <BudgetDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
        budget={editing}
        currentMonth={month}
      />
    </div>
  );
}
