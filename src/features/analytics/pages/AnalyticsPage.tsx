import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CardsSkeleton } from '@/components/TableSkeleton';
import { LoadError } from '@/components/LoadError';
import { StatCard } from '@/components/StatCard';
import { Percent, PiggyBank, TrendingDown, TrendingUp } from 'lucide-react';
import { formatMoney } from '@/lib/currency';

const BRAND = '#644fef';
import { getOverview } from '../api/analyticsApi';
import { useCachedResource } from '@/hooks/useCachedResource';
import {
  BudgetVsActual,
  CategoryBreakdown,
  IncomeVsExpenses,
  SavingsOverTime,
  SpendingTrend,
} from '../components/charts';

const RANGES = [
  { value: '3', label: 'Last 3 months' },
  { value: '6', label: 'Last 6 months' },
  { value: '12', label: 'Last 12 months' },
];

function Panel({ title, subtitle, children }: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const [months, setMonths] = useState('6');

  const { data, loading, error, refresh } = useCachedResource(
    `analytics:${months}`,
    () => getOverview({ months: Number(months) }),
  );

  // Skeleton only when there is no cached data to show yet.
  if (loading && !data) return <CardsSkeleton />;
  // A failed load offers a retry; a successful-but-empty load is a different
  // thing (a brand-new account) and just says so.
  if (error && !data) return <LoadError onRetry={refresh} />;
  if (!data) {
    return (
      <Alert>
        <AlertDescription>No analytics data yet.</AlertDescription>
      </Alert>
    );
  }

  const { totals } = data;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <Select value={months} onValueChange={setMonths}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RANGES.map((r) => (
              <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Income"
          value={formatMoney(totals.income)}
          icon={TrendingUp}
          accent="#1baf7a"
          hint={`${data.range.from} to ${data.range.to}`}
        />
        <StatCard
          label="Spending"
          value={formatMoney(totals.expense)}
          icon={TrendingDown}
          accent="#e34948"
          hint={`Across ${data.monthly.length} months`}
        />
        <StatCard
          label="Net saved"
          value={formatMoney(totals.savings)}
          icon={PiggyBank}
          accent={BRAND}
          hint={totals.savings < 0 ? 'You spent more than you earned' : 'Income minus spending'}
        />
        <StatCard
          label="Savings rate"
          value={`${totals.savingsRate}%`}
          icon={Percent}
          accent="#2a78d6"
          hint={totals.savingsRate >= 20 ? 'Healthy' : 'Room to improve'}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Income vs expenses" subtitle="Per month, transfers excluded">
          <IncomeVsExpenses data={data.monthly} />
        </Panel>

        <Panel title="Spending by category" subtitle={`${data.range.from} to ${data.range.to}`}>
          <CategoryBreakdown data={data.byCategory} />
        </Panel>

        <Panel title="Spending trend" subtitle="Daily spending across the range">
          <SpendingTrend data={data.trend} />
        </Panel>

        <Panel title="Budget vs actual" subtitle={`For ${data.budgetVsActual.month}`}>
          <BudgetVsActual data={data.budgetVsActual} />
        </Panel>

        <Panel
          title="Savings over time"
          subtitle="Running total of income minus spending"
        >
          <SavingsOverTime data={data.monthly} />
        </Panel>
      </div>
    </div>
  );
}
