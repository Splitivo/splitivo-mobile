/**
 * Formats a date string into "d MMM YYYY" format (e.g. "19 Apr 2026").
 * Falls back to the raw string if the date is invalid.
 */
export function formatDate(raw: string): string {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatCurrency(
  amount: number,
  currencyCode: string,
  decimals?: number,
): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  } catch {
    return `${currencyCode} ${amount}`;
  }
}
