import { CurrencyLocalDatasource } from "../datasources/local/CurrencyLocalDatasource";

const datasource = new CurrencyLocalDatasource();

/**
 * Formats an amount with the currency symbol and correct decimal digits.
 * Falls back to the raw code if the currency is not found.
 *
 * @example
 * formatCurrency(33110, "JPY")   // "¥33,110"
 * formatCurrency(2008000, "IDR") // "Rp2,008,000"
 * formatCurrency(60.2, "USD")    // "$60.20"
 */
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
  const currency = datasource.getByCode(currencyCode);

  if (!currency) {
    return `${currencyCode} ${amount}`;
  }

  const digits = decimals ?? currency.decimalDigits;
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

  return `${currency.symbol}${formatted}`;
}
