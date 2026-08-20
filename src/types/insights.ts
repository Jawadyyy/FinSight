export type InsightSeverity = 'positive' | 'info' | 'warning' | 'critical';

export interface InsightFact {
  type:
    | 'spending_change'
    | 'budget_exceeded'
    | 'budget_close'
    | 'top_category'
    | 'unusual_expense'
    | 'savings_rate'
    | 'no_budget';
  severity: InsightSeverity;
  message: string;
  data: Record<string, string | number>;
}

export interface Insights {
  month: string;
  currency: string;
  headline: string;
  summary: string;
  /** False when the wording came from templates because AI was unavailable. */
  aiGenerated: boolean;
  facts: InsightFact[];
}
