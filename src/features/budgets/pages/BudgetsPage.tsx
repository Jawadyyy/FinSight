import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Plus } from 'lucide-react';
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../api/budgetsApi';
import BudgetCard from '../components/BudgetCard';
import BudgetDialog from '../components/BudgetDialog';
import type { Budget } from '@/types/budget';

export default function BudgetsPage() {
  const now = new Date().toISOString().slice(0, 7);
  const [month, setMonth] = useState(now);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setBudgets(await getBudgets(month));
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (data: { category: string; month: string; limit: number }) => {
    if (editing) {
      await updateBudget(editing.id, { limit: data.limit });
    } else {
      await createBudget(data);
    }
    setEditing(null);
    await load();
  };

  const handleEdit = (budget: Budget) => {
    setEditing(budget);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteBudget(id);
    await load();
  };

  const totalLimit = budgets.reduce((s, b) => s + Number(b.limit), 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Budgets</h2>
        <div className="flex items-center gap-2">
          <Input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-40"
          />
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Set Budget
          </Button>
        </div>
      </div>

      {budgets.length > 0 && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Total Budget</span>
              <span className="text-muted-foreground">
                ${totalSpent.toFixed(2)} / ${totalLimit.toFixed(2)}
              </span>
            </div>
            <Progress
              value={totalLimit > 0 ? Math.min((totalSpent / totalLimit) * 100, 100) : 0}
              className={`h-3 ${totalSpent > totalLimit ? '[&>[data-slot=progress-indicator]]:bg-destructive' : ''}`}
            />
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="py-8 text-center text-muted-foreground">Loading...</p>
      ) : budgets.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          No budgets set for {month}. Click "Set Budget" to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {budgets.map((b) => (
            <BudgetCard
              key={b.id}
              budget={b}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
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
