import { createApiClient } from '@/lib/apiClient';
import type { Insights } from '@/types/insights';

const http = createApiClient('/insights');

export async function getInsights(month?: string): Promise<Insights> {
  const res = await http.get<Insights>('/', { params: month ? { month } : {} });
  return res.data;
}
