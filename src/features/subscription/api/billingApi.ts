import axios from 'axios';
import { api } from '@/lib/api';

const http = axios.create({
  baseURL: '/billing',
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

/** Whether the server has Stripe keys, so the UI can hide what cannot work. */
export async function getBillingStatus(): Promise<{ enabled: boolean }> {
  const res = await http.get<{ enabled: boolean }>('/status');
  return res.data;
}

/**
 * Starts an upgrade.
 *
 * Card details are collected on Stripe's own hosted page, so this app never
 * sees them — the only thing that happens here is a redirect.
 */
export async function startCheckout(): Promise<void> {
  const res = await http.post<{ url: string }>('/checkout');
  window.location.href = res.data.url;
}

/** Opens Stripe's portal for changing the card or cancelling. */
export async function openBillingPortal(): Promise<void> {
  const res = await http.post<{ url: string }>('/portal');
  window.location.href = res.data.url;
}
