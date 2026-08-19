import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatMoney } from '@/lib/currency';
import type { AnalyticsOverview } from '@/types/analytics';

/**
 * Fixed series colours, assigned by meaning rather than by position: income is
 * always green, spending always red, so a colour means the same thing on every
 * chart.
 */
export const SERIES = {
  income: '#1baf7a',
  expense: '#e34948',
  savings: '#2a78d6',
  budget: '#b4b2a9',
};

/** One colour per category, stable so a category never changes colour. */
const CATEGORY_COLORS: Record<string, string> = {
  Food: '#eb6834',
  Shopping: '#4a3aa7',
  Transport: '#2a78d6',
  Bills: '#e34948',
  Entertainment: '#e87ba4',
  Health: '#1baf7a',
  Other: '#888780',
};

/** Axis labels: 145,320 reads better as 145k. */
const compact = (value: number) => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${Math.round(value / 1_000)}k`;
  return String(value);
};

const monthLabel = (month: string) => {
  const [year, m] = month.split('-');
  return `${['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(m)]} ${year.slice(2)}`;
};

const axis = {
  stroke: 'currentColor',
  fontSize: 12,
  tickLine: false,
  axisLine: false,
  className: 'text-muted-foreground',
};

const tooltipStyle = {
  contentStyle: {
    borderRadius: 8,
    border: '1px solid hsl(var(--border))',
    background: 'hsl(var(--popover))',
    fontSize: 13,
  },
} as const;

const money = (value: number) => formatMoney(value);

function Empty({ label }: { label: string }) {
  return (
    <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}

export function IncomeVsExpenses({ data }: { data: AnalyticsOverview['monthly'] }) {
  if (!data.length) return <Empty label="No transactions in this range." />;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} className="stroke-border" />
        <XAxis dataKey="month" tickFormatter={monthLabel} {...axis} />
        <YAxis tickFormatter={compact} width={48} {...axis} />
        <Tooltip formatter={money} labelFormatter={monthLabel} {...tooltipStyle} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="income" name="Income" fill={SERIES.income} radius={[4, 4, 0, 0]} maxBarSize={28} />
        <Bar dataKey="expense" name="Expenses" fill={SERIES.expense} radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CategoryBreakdown({ data }: { data: AnalyticsOverview['byCategory'] }) {
  if (!data.length) return <Empty label="No spending to break down yet." />;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <ResponsiveContainer width="100%" height={220} className="sm:!w-1/2">
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
          >
            {data.map((row) => (
              <Cell key={row.category} fill={CATEGORY_COLORS[row.category] ?? SERIES.budget} />
            ))}
          </Pie>
          <Tooltip formatter={money} {...tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>

      {/* A legend with the numbers, rather than slice labels that overlap. */}
      <ul className="flex-1 space-y-1.5 text-sm">
        {data.map((row) => (
          <li key={row.category} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ background: CATEGORY_COLORS[row.category] ?? SERIES.budget }}
            />
            <span className="flex-1 truncate">{row.category}</span>
            <span className="tabular-nums text-muted-foreground">{row.percentage}%</span>
            <span className="w-28 text-right tabular-nums">{formatMoney(row.total)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SpendingTrend({ data }: { data: AnalyticsOverview['trend'] }) {
  if (!data.length) return <Empty label="No spending to chart yet." />;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} className="stroke-border" />
        <XAxis dataKey="date" minTickGap={28} {...axis} />
        <YAxis tickFormatter={compact} width={48} {...axis} />
        <Tooltip formatter={money} {...tooltipStyle} />
        <Line
          type="monotone"
          dataKey="expense"
          name="Spent"
          stroke={SERIES.expense}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function BudgetVsActual({ data }: { data: AnalyticsOverview['budgetVsActual'] }) {
  if (!data.rows.length) {
    return <Empty label={`No budgets set for ${data.month}.`} />;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data.rows}
        layout="vertical"
        margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
      >
        <CartesianGrid horizontal={false} className="stroke-border" />
        <XAxis type="number" tickFormatter={compact} {...axis} />
        <YAxis type="category" dataKey="category" width={92} {...axis} />
        <Tooltip formatter={money} {...tooltipStyle} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="limit" name="Budget" fill={SERIES.budget} radius={[0, 4, 4, 0]} maxBarSize={14} />
        <Bar dataKey="spent" name="Spent" radius={[0, 4, 4, 0]} maxBarSize={14}>
          {/* Red once the budget is blown, so the exception is visible. */}
          {data.rows.map((row) => (
            <Cell
              key={row.category}
              fill={row.spent > row.limit ? SERIES.expense : SERIES.income}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SavingsOverTime({ data }: { data: AnalyticsOverview['monthly'] }) {
  if (!data.length) return <Empty label="No transactions in this range." />;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="savingsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SERIES.savings} stopOpacity={0.25} />
            <stop offset="100%" stopColor={SERIES.savings} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} className="stroke-border" />
        <XAxis dataKey="month" tickFormatter={monthLabel} {...axis} />
        <YAxis tickFormatter={compact} width={48} {...axis} />
        <Tooltip formatter={money} labelFormatter={monthLabel} {...tooltipStyle} />
        <Area
          type="monotone"
          dataKey="cumulativeSavings"
          name="Saved to date"
          stroke={SERIES.savings}
          strokeWidth={2}
          fill="url(#savingsFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
