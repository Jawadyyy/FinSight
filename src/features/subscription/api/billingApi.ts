import { createApiClient } from '@/lib/apiClient';

const http = createApiClient('/billing');

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
