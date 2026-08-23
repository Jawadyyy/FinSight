import { createApiClient } from '@/lib/apiClient';
import type { Plan, SubscriptionStatus } from '@/types/subscription';

const http = createApiClient('/subscription');

export async function getSubscription(): Promise<SubscriptionStatus> {
  const res = await http.get<SubscriptionStatus>('/');
  return res.data;
}

export async function getPlans(): Promise<Plan[]> {
  const res = await http.get<Plan[]>('/plans');
  return res.data;
}
