import { CurrencyRepository } from "../../domain/repositories/CurrencyRepository";
import { Currency } from "../../domain/entities/currency";
import { buildUrl, ApiVersion } from "../../core/config/environment";
import { HttpResp } from "../../core/http";
import { withRepoLogging } from "../utils/withRepoLogging";
import { useAuthStore } from "../../presentation/stores/useAuthStore";

class CurrencyRepositoryBase implements CurrencyRepository {
  private cache: Currency[] | null = null;

  private async fetchAll(): Promise<Currency[]> {
    if (this.cache) return this.cache;
    const { url, method } = buildUrl(ApiVersion.V1, "system-currencies");
    const token = useAuthStore.getState().session?.accessToken;
    const res = await fetch(url, {
      method,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error(`Failed to fetch currencies: ${res.status}`);
    const json: HttpResp<Currency[]> = await res.json();
    this.cache = json.data.filter((c) => c.is_active);
    return this.cache;
  }

  async getAll(): Promise<Currency[]> {
    return this.fetchAll();
  }

  async getByCode(code: string): Promise<Currency | undefined> {
    const all = await this.fetchAll();
    return all.find((c) => c.code === code.toUpperCase());
  }

  async search(query: string): Promise<Currency[]> {
    const all = await this.fetchAll();
    const q = query.toLowerCase();
    return all.filter(
      (c) =>
        c.code?.toLowerCase().includes(q) ||
        c.name?.toLowerCase().includes(q) ||
        c.symbol?.toLowerCase().includes(q),
    );
  }
}

export const CurrencyRepositoryImpl = withRepoLogging(
  "CurrencyRepositoryImpl",
  new CurrencyRepositoryBase(),
);
