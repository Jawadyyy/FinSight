import axios from 'axios';
import { api } from '@/lib/api';
import type { Budget } from '@/types/budget';

const http = axios.create({
  baseURL: '/budgets',
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
