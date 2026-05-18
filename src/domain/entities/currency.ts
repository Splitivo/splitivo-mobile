export interface Currency {
  id: number;
  uid: string;
  name: string;
  code: string;
  symbol: string;
  decimal_precision: number;
  exchange_rate_to_usd: number;
  is_active: boolean;
  updated_at: string;
}
