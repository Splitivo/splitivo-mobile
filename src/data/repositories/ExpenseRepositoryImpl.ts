import { ExpenseRepository } from "../../domain/repositories/ExpenseRepository";
import {
  Expense,
  CategoryBreakdown,
  TimePeriod,
} from "../../domain/entities/expense";
import { MockExpenseDatasource } from "../datasources/mock/MockExpenseDatasource";
import { withRepoLogging } from "../utils/withRepoLogging";

class ExpenseRepositoryBase implements ExpenseRepository {
  private readonly datasource = new MockExpenseDatasource();
  async getExpenses(): Promise<Expense[]> {
    return this.datasource.getExpenses();
  }

  async getExpensesByPeriod(period: TimePeriod): Promise<Expense[]> {
    return this.datasource.getExpensesByPeriod(period);
  }

  async getCategoryBreakdown(period: TimePeriod): Promise<CategoryBreakdown[]> {
    return this.datasource.getCategoryBreakdown(period);
  }
}

export const ExpenseRepositoryImpl = withRepoLogging(
  "ExpenseRepositoryImpl",
  new ExpenseRepositoryBase(),
);
