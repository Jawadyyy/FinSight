import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatMoney } from '@/lib/currency';
import type { Budget } from '@/types/budget';

interface Props {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

export default function BudgetCard({ budget, onEdit, onDelete }: Props) {
  const limit = Number(budget.limit);
  const pct = limit > 0 ? Math.min((budget.spent / limit) * 100, 100) : 0;
  const overBudget = budget.spent > limit;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{budget.category}</CardTitle>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(budget)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(budget.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {formatMoney(budget.spent)} / {formatMoney(limit)}
          </span>
          <span className={overBudget ? 'text-destructive font-medium' : 'text-muted-foreground'}>
            {pct.toFixed(0)}%
          </span>
        </div>
        <Progress
          value={pct}
          className={`h-2 ${overBudget ? '[&>[data-slot=progress-indicator]]:bg-destructive' : pct > 80 ? '[&>[data-slot=progress-indicator]]:bg-yellow-500' : ''}`}
        />
        {overBudget && (
          <p className="text-xs text-destructive">
            Over budget by {formatMoney(budget.spent - limit)}
          </p>
        )}
        {!overBudget && budget.remaining > 0 && (
          <p className="text-xs text-muted-foreground">
            {formatMoney(budget.remaining)} remaining
          </p>
        )}
      </CardContent>
    </Card>
  );
}
