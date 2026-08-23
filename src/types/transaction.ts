export type TransactionType = 'income' | 'expense' | 'transfer';

/**
 * The single source of truth for categories — forms, filters and the colour
 * map all read this, so adding one is a one-line change. Must match
 * TransactionCategory on the backend.
 */
export const TRANSACTION_CATEGORIES = [
  'Food',
  'Shopping',
  'Transport',
  'Bills',
  'Entertainment',
  'Health',
  'Other',
] as const;

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number];

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  merchant?: string | null;
  reference?: string | null;
  currency: string;
  originalAmount?: number | null;
  originalCurrency?: string | null;
  balanceAfter?: number | null;
  confidence: number;
  needsReview: boolean;
  categoryConfidence: number;
  categorySource?: 'rule' | 'ai' | 'manual' | null;
  rawText?: string | null;
  category: TransactionCategory;
  type: TransactionType;
  /** 'scan' = read by OCR from an image-only PDF, so always flagged for review. */
  source: 'manual' | 'csv' | 'pdf' | 'scan';
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionsResponse {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TransactionFilters {
  category?: TransactionCategory;
  type?: TransactionType;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface CategorizeResult {
  categorized: number;
  byAi: number;
  byRule: number;
  aiEnabled: boolean;
}

export interface UploadResult {
  imported: number;
  skipped: number;
  duplicates: number;
  needsReview: number;
  warnings: string[];
}
