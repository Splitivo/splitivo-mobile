import { Currency } from "../entities/currency";

export interface CurrencyRepository {
  getAll(): Promise<Currency[]>;
  getByCode(code: string): Promise<Currency | undefined>;
  search(query: string): Promise<Currency[]>;
}
