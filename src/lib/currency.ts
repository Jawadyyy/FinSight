/**
 * Formats money in the transaction's own currency rather than a hardcoded $.
 * Statements are in PKR, so that is the default.
 */
export function formatMoney(amount: number | string, currency = 'PKR'): string {
  const value = Number(amount);
  if (isNaN(value)) return '—';

  try {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    // Unknown currency code — fall back to the code plus a plain number.
    return `${currency} ${value.toFixed(2)}`;
  }
}

/** Signed form for a transaction row: +PKR 1,499.00 / -PKR 2,500.00. */
export function formatSignedMoney(
  amount: number | string,
  currency: string,
  type: 'income' | 'expense' | 'transfer',
): string {
  const formatted = formatMoney(amount, currency);
  if (type === 'income') return `+${formatted}`;
  if (type === 'expense') return `-${formatted}`;
  return formatted;
}
