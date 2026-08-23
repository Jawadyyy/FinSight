import { createApiClient } from '@/lib/apiClient';
import type { Budget } from '@/types/budget';

const http = createApiClient('/budgets');

export async function getBudgets(month?: string): Promise<Budget[]> {
  const params = month ? { month } : {};
  const res = await http.get<Budget[]>('/', { params });
  return res.data;
}

export async function createBudget(data: {
  category: string;
  month: string;
  limit: number;
}): Promise<Budget> {
  const res = await http.post<Budget>('/', data);
  return res.data;
}

export async function updateBudget(
  id: string,
  data: { limit: number },
): Promise<Budget> {
  const res = await http.patch<Budget>(`/${id}`, data);
  return res.data;
}

export async function deleteBudget(id: string): Promise<void> {
  await http.delete(`/${id}`);
}
