import type { Transaction } from '@/types/transaction';

/** Shared between the table row and the detail dialog so they never disagree. */
export const categoryColor: Record<string, string> = {
  Food: 'bg-orange-100 text-orange-800',
  Shopping: 'bg-purple-100 text-purple-800',
  Transport: 'bg-blue-100 text-blue-800',
  Bills: 'bg-red-100 text-red-800',
  Entertainment: 'bg-pink-100 text-pink-800',
  Health: 'bg-teal-100 text-teal-800',
  Other: 'bg-gray-100 text-gray-800',
};

/** Below this the model was hedging, so the badge invites a correction. */
const CATEGORY_CONFIDENT = 0.6;

export function isCategoryUncertain(tx: Transaction): boolean {
  if (tx.categorySource === 'manual' || tx.categorySource === 'rule') return false;
  return Number(tx.categoryConfidence) < CATEGORY_CONFIDENT;
}

export function describeCategory(tx: Transaction): string {
  const pct = Math.round(Number(tx.categoryConfidence) * 100);
  switch (tx.categorySource) {
    case 'manual':
      return 'You set this category.';
    case 'rule':
      return 'Matched a known merchant.';
    case 'ai':
      return `AI categorized this (${pct}% confident). Edit the row to correct it.`;
    default:
      return 'Not categorized yet. Use Categorize, or edit the row to set one.';
  }
}
