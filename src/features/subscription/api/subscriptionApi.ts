import axios from 'axios';
import { api } from '@/lib/api';
import type { Plan, SubscriptionStatus } from '@/types/subscription';

const http = axios.create({
  baseURL: '/subscription',
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const token = api.defaults.headers.common.Authorization;
  if (token) config.headers.Authorization = token;
  return config;
});

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

export async function getSubscription(): Promise<SubscriptionStatus> {
  const res = await http.get<SubscriptionStatus>('/');
  return res.data;
}

export async function getPlans(): Promise<Plan[]> {
  const res = await http.get<Plan[]>('/plans');
  return res.data;
}
