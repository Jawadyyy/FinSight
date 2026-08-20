import { Progress } from '@/components/ui/progress';

/**
 * Spending against budget, with a marker for where today falls in the month.
 *
 * A percentage alone cannot tell you whether you are in trouble: 78% spent is
 * fine on the 25th and alarming on the 8th. The marker makes the comparison
 * immediate — bar past marker means spending faster than the month is passing.
 */
export function PaceBar({
  spent,
  limit,
  dayFraction,
}: {
  spent: number;
  limit: number;
  dayFraction: number;
}) {
  const used = limit > 0 ? spent / limit : 0;
  const over = used > 1;
  const aheadOfPace = used > dayFraction;

  const indicator = over
    ? '[&>[data-slot=progress-indicator]]:bg-destructive'
    : aheadOfPace
      ? '[&>[data-slot=progress-indicator]]:bg-amber-500'
      : '[&>[data-slot=progress-indicator]]:bg-emerald-600';

  return (
    <div className="relative">
      <Progress
        value={Math.min(used, 1) * 100}
        className={`h-3 ${indicator}`}
        aria-label={`${Math.round(used * 100)}% of budget used`}
      />
      {/* Where the month itself has got to. */}
      <div
        className="absolute inset-y-0 w-0.5 bg-foreground/70"
        style={{ left: `${Math.min(dayFraction, 1) * 100}%` }}
        aria-hidden
      />
    </div>
  );
}
