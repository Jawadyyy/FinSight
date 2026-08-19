export interface MonthlyPoint {
  month: string;
  income: number;
  expense: number;
  savings: number;
  cumulativeSavings: number;
}

export interface AnalyticsOverview {
  range: { from: string; to: string };
  totals: { income: number; expense: number; savings: number; savingsRate: number };
  monthly: MonthlyPoint[];
  byCategory: { category: string; total: number; percentage: number }[];
  trend: { date: string; expense: number }[];
  budgetVsActual: {
    month: string;
    rows: { category: string; limit: number; spent: number; remaining: number }[];
  };
}
