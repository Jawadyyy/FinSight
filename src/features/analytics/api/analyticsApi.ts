import { createApiClient } from '@/lib/apiClient';
import type { AnalyticsOverview } from '@/types/analytics';

const http = createApiClient('/analytics');

export async function getOverview(params: {
  months?: number;
  month?: string;
}): Promise<AnalyticsOverview> {
  const res = await http.get<AnalyticsOverview>('/overview', { params });
  return res.data;
}
