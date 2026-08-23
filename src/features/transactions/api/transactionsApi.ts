import { createApiClient } from '@/lib/apiClient';
import type {
  Transaction,
  TransactionsResponse,
  TransactionFilters,
  UploadResult,
  CategorizeResult,
} from '@/types/transaction';

const http = createApiClient('/transactions');

export async function getTransactions(filters?: TransactionFilters): Promise<TransactionsResponse> {
  const params = filters ? Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== ''),
  ) : {};
  const res = await http.get<TransactionsResponse>('/', { params });
  return res.data;
}

export async function getTransaction(id: string): Promise<Transaction> {
  const res = await http.get<Transaction>(`/${id}`);
  return res.data;
}

export async function createTransaction(
  data: Omit<Transaction, 'id' | 'source' | 'createdAt' | 'updatedAt' | 'userId'>,
): Promise<Transaction> {
  const res = await http.post<Transaction>('/', data);
  return res.data;
}

export async function updateTransaction(
  id: string,
  data: Partial<Pick<Transaction, 'amount' | 'description' | 'category' | 'type' | 'date'>>,
): Promise<Transaction> {
  const res = await http.patch<Transaction>(`/${id}`, data);
  return res.data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await http.delete(`/${id}`);
}

export async function categorizeTransactions(all = false): Promise<CategorizeResult> {
  const res = await http.post<CategorizeResult>('/categorize', null, {
    params: all ? { all: 'true' } : {},
  });
  return res.data;
}

export async function uploadTransactions(file: File): Promise<UploadResult> {
  const form = new FormData();
  form.append('file', file);
  const res = await http.post<UploadResult>('/upload', form);
  return res.data;
}
