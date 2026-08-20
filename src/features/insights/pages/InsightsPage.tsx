import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  CircleAlert,
  Info,
  PiggyBank,
  Receipt,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { formatMoney } from '@/lib/currency';
import { getInsights } from '../api/insightsApi';
import type { InsightFact, InsightSeverity, Insights } from '@/types/insights';

const BRAND = '#644fef';

const TONE: Record<
  InsightSeverity,
  { ring: string; chip: string; label: string }
> = {
  critical: {
    ring: 'border-l-destructive',
    chip: 'bg-destructive/10 text-destructive',
    label: 'Needs attention',
  },
  warning: {
    ring: 'border-l-amber-500',
    chip: 'bg-amber-100 text-amber-800',
    label: 'Worth a look',
  },
  positive: {
    ring: 'border-l-emerald-500',
    chip: 'bg-emerald-100 text-emerald-800',
    label: 'Going well',
  },
  info: {
    ring: 'border-l-muted-foreground/40',
    chip: 'bg-muted text-muted-foreground',
    label: 'Context',
  },
};

const ICONS: Record<InsightFact['type'], typeof Info> = {
  spending_change: TrendingUp,
  budget_exceeded: CircleAlert,
  budget_close: PiggyBank,
  top_category: Receipt,
  unusual_expense: Wallet,
  savings_rate: TrendingDown,
  no_budget: Info,
};

const num = (v: unknown) => Number(v ?? 0);

/**
 * The supporting figures for a fact.
 *
 * Each rule already returns the numbers it reasoned from, so the card can show
 * the working rather than just the sentence — which is the difference between
 * being told something and being able to check it.
 */
function FactDetail({ fact, currency }: { fact: InsightFact; currency: string }) {
  const d = fact.data;

  switch (fact.type) {
    case 'budget_exceeded':
    case 'budget_close': {
      const limit = num(d.limit) || num(d.remaining) + num(d.spent);
      const spent = num(d.spent) || limit - num(d.remaining);
      const pct = limit ? Math.min((spent / limit) * 100, 100) : 0;
      const over = spent > limit;

      return (
        <div className="space-y-1.5">
          <Progress
            value={pct}
            className={`h-2 ${over ? '[&>[data-slot=progress-indicator]]:bg-destructive' : '[&>[data-slot=progress-indicator]]:bg-amber-500'}`}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatMoney(spent, currency)} spent</span>
            <span>{formatMoney(limit, currency)} budget</span>
          </div>
        </div>
      );
    }

    case 'spending_change': {
      const now = num(d.thisMonth);
      const before = num(d.lastMonth);
      const peak = Math.max(now, before) || 1;

      return (
        <div className="space-y-2">
          {[
            { label: 'Last month', value: before, tone: 'bg-muted-foreground/30' },
            { label: 'This month', value: now, tone: num(d.changePct) > 0 ? 'bg-destructive' : 'bg-emerald-500' },
          ].map((bar) => (
            <div key={bar.label} className="flex items-center gap-2">
              <span className="w-20 shrink-0 text-xs text-muted-foreground">{bar.label}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div className={`h-full rounded-full ${bar.tone}`}
                  style={{ width: `${(bar.value / peak) * 100}%` }} />
              </div>
              <span className="w-24 shrink-0 text-right text-xs tabular-nums">
                {formatMoney(bar.value, currency)}
              </span>
            </div>
          ))}
        </div>
      );
    }

    case 'savings_rate': {
      const income = num(d.income);
      const expense = num(d.expense);
      const kept = Math.max(income - expense, 0);
      const keptPct = income ? (kept / income) * 100 : 0;

      return (
        <div className="space-y-1.5">
          <div className="flex h-2 overflow-hidden rounded-full bg-muted">
            <div className="bg-destructive" style={{ width: `${100 - keptPct}%` }} />
            <div className="bg-emerald-500" style={{ width: `${keptPct}%` }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatMoney(expense, currency)} spent</span>
            <span>{formatMoney(kept, currency)} kept</span>
          </div>
        </div>
      );
    }

    case 'top_category':
      return (
        <div className="space-y-1.5">
          <Progress value={num(d.percentage)} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{d.category}</span>
            <span>{formatMoney(num(d.total), currency)} · {num(d.percentage)}% of spending</span>
          </div>
        </div>
      );

    case 'unusual_expense':
      return (
        <div className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-2 text-xs">
          <span className="font-medium">{String(d.merchant ?? '')}</span>
          <span className="text-muted-foreground">{String(d.date ?? '')}</span>
          <span className="font-semibold tabular-nums">
            {formatMoney(num(d.amount), currency)}
          </span>
        </div>
      );

    default:
      return null;
  }
}

function FactCard({ fact, currency }: { fact: InsightFact; currency: string }) {
  const tone = TONE[fact.severity];
  const Icon = ICONS[fact.type] ?? Info;

  return (
    <Card className={`border-l-4 shadow-none ${tone.ring}`}>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-sm font-medium leading-snug">{fact.message}</p>
          </div>
          <Badge variant="secondary" className={`shrink-0 ${tone.chip}`}>
            {tone.label}
          </Badge>
        </div>

        <FactDetail fact={fact} currency={currency} />
      </CardContent>
    </Card>
  );
}

export default function InsightsPage() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [data, setData] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const result = await getInsights(month);
        if (!cancelled) setData(result);
      } catch {
        if (!cancelled) setError('Could not load insights for this month.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [month]);

  const grouped = data
    ? {
        attention: data.facts.filter((f) => f.severity === 'critical' || f.severity === 'warning'),
        good: data.facts.filter((f) => f.severity === 'positive'),
        context: data.facts.filter((f) => f.severity === 'info'),
      }
    : null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Insights</h2>
          <p className="text-sm text-muted-foreground">
            What changed this month, and the numbers behind it.
          </p>
        </div>
        <Input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-44"
        />
      </div>

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-36 w-full rounded-xl" />
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        </div>
      )}

      {!loading && error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && data && data.facts.length === 0 && (
        <Card className="shadow-none">
          <CardContent className="py-16 text-center">
            <Sparkles className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="font-medium">Nothing to report for {month}</p>
            <p className="text-sm text-muted-foreground">
              Upload a statement for this month, or pick a month with activity.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && data && data.facts.length > 0 && grouped && (
        <>
          {/* The narrative, on brand, with its provenance stated plainly. */}
          <Card className="border-none shadow-none" style={{ backgroundColor: `${BRAND}0f` }}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: BRAND }}
                  >
                    <Sparkles className="h-5 w-5 text-white" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold">{data.headline}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
                      {data.summary}
                    </p>
                  </div>
                </div>

                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary" className="shrink-0 cursor-default">
                        {data.aiGenerated ? 'Written by AI' : 'Written from rules'}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      Every figure is calculated from your transactions.
                      {data.aiGenerated
                        ? ' AI only writes the wording.'
                        : ' AI was unavailable, so this uses templates.'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>

          {([
            ['Needs attention', grouped.attention],
            ['Going well', grouped.good],
            ['Context', grouped.context],
          ] as const).map(([title, facts]) =>
            facts.length === 0 ? null : (
              <div key={title} className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {title}
                  <span className="ml-2 font-normal">({facts.length})</span>
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {facts.map((fact, i) => (
                    <FactCard key={`${fact.type}-${i}`} fact={fact} currency={data.currency} />
                  ))}
                </div>
              </div>
            ),
          )}
        </>
      )}
    </div>
  );
}
