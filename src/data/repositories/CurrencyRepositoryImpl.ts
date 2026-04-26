import { CurrencyRepository } from "../../domain/repositories/CurrencyRepository";
import { Currency } from "../../domain/entities/currency";
import { CurrencyLocalDatasource } from "../datasources/local/CurrencyLocalDatasource";

const datasource = new CurrencyLocalDatasource();

export class CurrencyRepositoryImpl implements CurrencyRepository {
  async getAll(): Promise<Currency[]> {
    return datasource.getAll();
  }

  async getByCode(code: string): Promise<Currency | undefined> {
    return datasource.getByCode(code);
  }

  async search(query: string): Promise<Currency[]> {
    return datasource.search(query);
  }
}
