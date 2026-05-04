import { CurrencyRepository } from "../../domain/repositories/CurrencyRepository";
import { Currency } from "../../domain/entities/currency";
import { CurrencyLocalDatasource } from "../datasources/local/CurrencyLocalDatasource";
import { withRepoLogging } from "../utils/withRepoLogging";

class CurrencyRepositoryBase implements CurrencyRepository {
  private readonly datasource = new CurrencyLocalDatasource();
  async getAll(): Promise<Currency[]> {
    return this.datasource.getAll();
  }

  async getByCode(code: string): Promise<Currency | undefined> {
    return this.datasource.getByCode(code);
  }

  async search(query: string): Promise<Currency[]> {
    return this.datasource.search(query);
  }
}

export const CurrencyRepositoryImpl = withRepoLogging(
  "CurrencyRepositoryImpl",
  new CurrencyRepositoryBase(),
);
