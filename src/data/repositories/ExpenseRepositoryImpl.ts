import { ExpenseRepository } from "../../domain/repositories/ExpenseRepository";
import {
  Expense,
  CategoryBreakdown,
  TimePeriod,
} from "../../domain/entities/expense";
import { MockExpenseDatasource } from "../datasources/mock/MockExpenseDatasource";

const datasource = new MockExpenseDatasource();

export class ExpenseRepositoryImpl implements ExpenseRepository {
  async getExpenses(): Promise<Expense[]> {
    return datasource.getExpenses();
  }

  async getExpensesByPeriod(period: TimePeriod): Promise<Expense[]> {
    return datasource.getExpensesByPeriod(period);
  }

  async getCategoryBreakdown(period: TimePeriod): Promise<CategoryBreakdown[]> {
    return datasource.getCategoryBreakdown(period);
  }
}
