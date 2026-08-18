import axios from 'axios';
import { api } from '@/lib/api';
import type {
  Transaction,
  TransactionsResponse,
  TransactionFilters,
} from '@/types/transaction';

const http = axios.create({
  baseURL: '/transactions',
  withCredentials: true,
});

// Share the auth header from the main api instance.
http.interceptors.request.use((config) => {
  const token = api.defaults.headers.common.Authorization;
  if (token) config.headers.Authorization = token;
  return config;
});

// Reuse the same 401 → refresh logic.
http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await api.post<{ accessToken: string }>('/refresh');
        const bearer = `Bearer ${data.accessToken}`;
        api.defaults.headers.common.Authorization = bearer;
        http.defaults.headers.common.Authorization = bearer;
        original.headers.Authorization = bearer;
        return http(original);
      } catch { /* let 401 bubble */ }
    }
    return Promise.reject(error);
  },
);

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
