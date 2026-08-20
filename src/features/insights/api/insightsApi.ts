import axios from 'axios';
import { api } from '@/lib/api';
import type { Insights } from '@/types/insights';

const http = axios.create({
  baseURL: '/insights',
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

export async function getInsights(month?: string): Promise<Insights> {
  const res = await http.get<Insights>('/', { params: month ? { month } : {} });
  return res.data;
}
