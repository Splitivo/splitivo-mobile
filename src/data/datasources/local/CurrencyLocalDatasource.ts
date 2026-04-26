import { Currency } from "../../../domain/entities/currency";
import currencyList from "../../mocks/currency-list.json";

type RawCurrency = {
  symbol: string;
  name: string;
  symbol_native: string;
  decimal_digits: number;
  rounding: number;
  code: string;
  name_plural: string;
};

function mapToCurrency(raw: RawCurrency): Currency {
  return {
    code: raw.code,
    name: raw.name,
    namePlural: raw.name_plural,
    symbol: raw.symbol,
    symbolNative: raw.symbol_native,
    decimalDigits: raw.decimal_digits,
    rounding: raw.rounding,
  };
}

const currencies: Currency[] = Object.values(
  currencyList as Record<string, RawCurrency>,
).map(mapToCurrency);

export class CurrencyLocalDatasource {
  getAll(): Currency[] {
    return currencies;
  }

  getByCode(code: string): Currency | undefined {
    return currencies.find((c) => c.code === code.toUpperCase());
  }

  search(query: string): Currency[] {
    const q = query.toLowerCase();
    return currencies.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q),
    );
  }
}
