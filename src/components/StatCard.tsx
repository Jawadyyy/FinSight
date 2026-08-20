import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * The headline figure card used across the dashboard, analytics and budgets.
 *
 * Shared rather than copied so a stat means the same thing wherever it appears:
 * same accent bar, same icon treatment, same rules for the change badge.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  change,
  /** For spending, a fall is good news — colour cannot follow the sign alone. */
  goodWhenDown = false,
  hint,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  accent: string;
  change?: number | null;
  goodWhenDown?: boolean;
  hint?: string;
}) {
  const up = (change ?? 0) > 0;
  const good = change == null ? null : goodWhenDown ? !up : up;

  return (
    <Card className="overflow-hidden shadow-none">
      {/* A thin accent keeps a row of cards distinguishable at a glance. */}
      <div className="h-1 w-full" style={{ backgroundColor: accent }} />
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <p className="text-sm text-muted-foreground">{label}</p>
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${accent}1a`, color: accent }}
          >
            <Icon className="h-4 w-4" />
          </span>
        </div>

        <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>

        <div className="mt-3 flex items-center gap-2">
          {change != null ? (
            <>
              <span
                className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium ${
                  good ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                }`}
              >
                {up ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </>
          ) : (
            <span className="text-xs text-muted-foreground">{hint ?? '—'}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
