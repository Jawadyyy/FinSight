import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatMoney } from '@/lib/currency';
import type { Budget } from '@/types/budget';

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#eb6834',
  Shopping: '#4a3aa7',
  Transport: '#2a78d6',
  Bills: '#e34948',
  Entertainment: '#e87ba4',
  Health: '#1baf7a',
  Other: '#888780',
};

interface Props {
  budget: Budget;
  /** Where the month has got to, so the bar can show pace rather than a raw total. */
  dayFraction: number;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

export default function BudgetCard({ budget, dayFraction, onEdit, onDelete }: Props) {
  const limit = Number(budget.limit);
  const used = limit > 0 ? budget.spent / limit : 0;
  const pct = Math.min(used * 100, 100);
  const over = budget.spent > limit;
  const aheadOfPace = !over && used > dayFraction;
  const accent = CATEGORY_COLORS[budget.category] ?? '#888780';

  const status = over
    ? { label: 'Over budget', className: 'bg-destructive/10 text-destructive' }
    : aheadOfPace
      ? { label: 'Ahead of pace', className: 'bg-amber-100 text-amber-800' }
      : { label: 'On track', className: 'bg-emerald-100 text-emerald-800' };

  const indicator = over
    ? '[&>[data-slot=progress-indicator]]:bg-destructive'
    : aheadOfPace
      ? '[&>[data-slot=progress-indicator]]:bg-amber-500'
      : '[&>[data-slot=progress-indicator]]:bg-emerald-600';

  return (
    <Card className="overflow-hidden shadow-none">
      <div className="h-1 w-full" style={{ backgroundColor: accent }} />
      <CardContent className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-semibold">{budget.category}</p>
            <p className="text-xs text-muted-foreground">
              {formatMoney(limit)} budgeted
            </p>
          </div>

          {/* Actions stay quiet until the card is hovered or focused. */}
          <div className="flex shrink-0 gap-1 opacity-60 transition-opacity hover:opacity-100 focus-within:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              aria-label={`Edit ${budget.category} budget`}
              onClick={() => onEdit(budget)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              aria-label={`Delete ${budget.category} budget`}
              onClick={() => onDelete(budget.id)}
            >
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <p className="text-xl font-semibold tabular-nums">
            {formatMoney(budget.spent)}
          </p>
          <Badge variant="secondary" className={status.className}>
            {status.label}
          </Badge>
        </div>

        <div className="relative">
          <Progress value={pct} className={`h-2.5 ${indicator}`} />
          {/* Marker for how far through the month we are. */}
          {!over && (
            <div
              className="absolute inset-y-0 w-0.5 bg-foreground/50"
              style={{ left: `${Math.min(dayFraction, 1) * 100}%` }}
              aria-hidden
            />
          )}
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{Math.round(used * 100)}% used</span>
          <span className={over ? 'font-medium text-destructive' : 'text-muted-foreground'}>
            {over
              ? `${formatMoney(budget.spent - limit)} over`
              : `${formatMoney(budget.remaining)} left`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
