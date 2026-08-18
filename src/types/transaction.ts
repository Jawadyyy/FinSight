export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'Food'
  | 'Shopping'
  | 'Transport'
  | 'Bills'
  | 'Entertainment'
  | 'Other';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: TransactionCategory;
  type: TransactionType;
  source: 'manual' | 'csv' | 'pdf';
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
