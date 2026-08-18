import type { TransactionCategory } from './transaction';

export interface Budget {
  id: string;
  category: TransactionCategory;
  month: string;
  limit: number;
  spent: number;
  remaining: number;
  createdAt: string;
  updatedAt: string;
}
