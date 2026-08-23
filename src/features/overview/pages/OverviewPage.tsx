import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { CardsSkeleton } from '@/components/TableSkeleton';
import { StatCard } from '@/components/StatCard';
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Receipt,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Upload,
  Wallet,
} from 'lucide-react';
import { formatMoney } from '@/lib/currency';
import { getOverview } from '@/features/analytics/api/analyticsApi';
import { getTransactions } from '@/features/transactions/api/transactionsApi';
import { IncomeVsExpenses } from '@/features/analytics/components/charts';
import { PaceBar } from '../components/PaceBar';
import type { AnalyticsOverview } from '@/types/analytics';
import type { Transaction } from '@/types/transaction';

const BRAND = '#644fef';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#eb6834',
  Shopping: '#4a3aa7',
  Transport: '#2a78d6',
  Bills: '#e34948',
  Entertainment: '#e87ba4',
  Health: '#1baf7a',
  Other: '#888780',
};

const RANGES = [
  { value: '3', label: 'Last 3 months' },
  { value: '6', label: 'Last 6 months' },
  { value: '12', label: 'Last 12 months' },
];

/** Percentage change against last month; null when there is nothing to compare. */
function delta(current: number, previous: number): number | null {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

interface Props {
  onNavigate: (page: 'transactions' | 'budgets' | 'analytics' | 'insights') => void;
}

export default function OverviewPage({ onNavigate }: Props) {
  const [months, setMonths] = useState('6');
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [recent, setRecent] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [overview, page] = await Promise.all([
          getOverview({ months: Number(months) }),
          getTransactions({ page: 1, limit: 5 }),
        ]);
        if (cancelled) return;
        setData(overview);
        setRecent(page.data);
        setTotal(page.total);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [months]);

  if (loading) return <CardsSkeleton />;

  const thisMonth = data?.monthly[data.monthly.length - 1];
  const lastMonth = data?.monthly[data.monthly.length - 2];
  const hasData = Boolean(thisMonth && (thisMonth.income || thisMonth.expense));

  if (!data || !hasData) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-20 text-center">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="font-medium">No transactions yet</p>
            <p className="text-sm text-muted-foreground">
              Upload a bank statement and your spending appears here.
            </p>
          </div>
          <Button
            onClick={() => onNavigate('transactions')}
            style={{ backgroundColor: BRAND }}
            className="text-white"
          >
            Upload a statement
          </Button>
        </CardContent>
      </Card>
    );
  }

  const budgets = data.budgetVsActual.rows;
  const budgetTotal = budgets.reduce((sum, b) => sum + b.limit, 0);
  const overBudget = budgets.filter((b) => b.spent > b.limit);
  const needsReview = recent.filter((t) => t.needsReview).length;

  const [year, month] = data.budgetVsActual.month.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const now = new Date();
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() + 1 === month;
  const dayOfMonth = isCurrentMonth ? now.getDate() : daysInMonth;
  const dayFraction = dayOfMonth / daysInMonth;

  const spent = thisMonth!.expense;
  const usedPct = budgetTotal ? Math.round((spent / budgetTotal) * 100) : 0;
  const aheadOfPace = budgetTotal > 0 && spent / budgetTotal > dayFraction;

  const topCategories = data.byCategory.slice(0, 5);
  const biggest = topCategories[0]?.total ?? 1;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Here&apos;s what happened to your money in {MONTH_NAMES[month - 1]} {year}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => onNavigate('insights')}>
            <Sparkles className="mr-2 h-4 w-4" />
            View insights
          </Button>
          <Select value={months} onValueChange={setMonths}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RANGES.map((r) => (
                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total spending"
          value={formatMoney(spent)}
          icon={TrendingDown}
          accent="#e34948"
          change={lastMonth ? delta(spent, lastMonth.expense) : null}
          goodWhenDown
          hint="No earlier month to compare"
        />
        <StatCard
          label="Total income"
          value={formatMoney(thisMonth!.income)}
          icon={TrendingUp}
          accent="#1baf7a"
          change={lastMonth ? delta(thisMonth!.income, lastMonth.income) : null}
          hint="No earlier month to compare"
        />
        <StatCard
          label="Net saved"
          value={formatMoney(thisMonth!.savings)}
          icon={PiggyBank}
          accent={BRAND}
          change={lastMonth ? delta(thisMonth!.savings, lastMonth.savings) : null}
          hint="No earlier month to compare"
        />
        <StatCard
          label="Transactions"
          value={String(total)}
          icon={Receipt}
          accent="#888780"
          hint={`${data.byCategory.length} categories in use`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-none lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Income vs expenses</CardTitle>
              <p className="text-sm text-muted-foreground">
                Month by month, transfers excluded
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={() => onNavigate('analytics')}
            >
              Analytics <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <IncomeVsExpenses data={data.monthly} />
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Top categories</CardTitle>
            <p className="text-sm text-muted-foreground">Where the money went</p>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {topCategories.map((c) => (
              <div key={c.category} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{c.category}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {formatMoney(c.total)}
                  </span>
                </div>
                <Progress
                  value={(c.total / biggest) * 100}
                  className="h-1.5"
                  aria-label={`${c.category}: ${c.percentage}% of spending`}
                  style={
                    {
                      // Progress paints its bar from this token, so each
                      // category keeps its own colour.
                      '--primary': CATEGORY_COLORS[c.category] ?? '#888780',
                    } as React.CSSProperties
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-none lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              {MONTH_NAMES[month - 1]} budget
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {isCurrentMonth ? `Day ${dayOfMonth} of ${daysInMonth}` : 'Complete month'}
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {budgetTotal > 0 ? (
              <>
                <PaceBar spent={spent} limit={budgetTotal} dayFraction={dayFraction} />
                <div className="flex flex-wrap justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">
                    {usedPct}% of {formatMoney(budgetTotal)} budgeted
                  </span>
                  <span
                    className={`font-medium ${
                      spent > budgetTotal
                        ? 'text-destructive'
                        : aheadOfPace
                          ? 'text-amber-600'
                          : 'text-emerald-700'
                    }`}
                  >
                    {spent > budgetTotal
                      ? `Over by ${formatMoney(spent - budgetTotal)}`
                      : aheadOfPace
                        ? 'Spending faster than the month'
                        : 'On track'}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between rounded-md bg-muted/60 p-3 text-sm">
                <span className="text-muted-foreground">
                  Set a budget to track spending against a limit.
                </span>
                <Button variant="outline" size="sm" onClick={() => onNavigate('budgets')}>
                  Set budgets
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Needs attention</CardTitle>
            {overBudget.length > 0 && (
              <Badge variant="destructive">{overBudget.length}</Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-2">
            {overBudget.length === 0 && needsReview === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Nothing needs looking at.
              </p>
            ) : (
              <>
                {overBudget.map((b) => (
                  <Button
                    key={b.category}
                    variant="outline"
                    onClick={() => onNavigate('budgets')}
                    className="h-auto w-full justify-between border-destructive/30 bg-destructive/5 py-2.5 hover:bg-destructive/10"
                  >
                    <span className="font-medium">{b.category}</span>
                    <span className="tabular-nums text-destructive">
                      over by {formatMoney(b.spent - b.limit)}
                    </span>
                  </Button>
                ))}
                {needsReview > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('transactions')}
                    className="h-auto w-full justify-start gap-2 border-amber-300 bg-amber-50 py-2.5 hover:bg-amber-100"
                  >
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                    <span>{needsReview} transaction{needsReview === 1 ? '' : 's'} to check</span>
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div>
            <CardTitle className="text-base font-semibold">Recent transactions</CardTitle>
            <p className="text-sm text-muted-foreground">
              Your five most recent entries.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={() => onNavigate('transactions')}
          >
            View all <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Merchant</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="pr-6 text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="max-w-[220px] pl-6">
                      <p className="truncate font-medium">{tx.merchant ?? tx.description}</p>
                      {tx.merchant && (
                        <p className="truncate text-xs text-muted-foreground">
                          {tx.description}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[tx.category] ?? '#888780'}1a`,
                          color: CATEGORY_COLORS[tx.category] ?? '#888780',
                        }}
                      >
                        {tx.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm capitalize text-muted-foreground">
                      {tx.type}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {tx.date}
                    </TableCell>
                    <TableCell
                      className={`pr-6 text-right font-medium tabular-nums ${
                        tx.type === 'income' ? 'text-emerald-700' : ''
                      }`}
                    >
                      {tx.type === 'income' ? '+' : tx.type === 'expense' ? '−' : ''}
                      {formatMoney(tx.amount, tx.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="border-t px-6 py-3 text-xs text-muted-foreground">
            Showing {recent.length} of {total} transactions
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
