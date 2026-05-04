import { ExpenseRepository } from "../../domain/repositories/ExpenseRepository";
import {
  Expense,
  CategoryBreakdown,
  TimePeriod,
} from "../../domain/entities/expense";
import { MockExpenseDatasource } from "../datasources/mock/MockExpenseDatasource";
import { withRepoLogging } from "../utils/withRepoLogging";

const datasource = new MockExpenseDatasource();

class ExpenseRepositoryBase implements ExpenseRepository {
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

export const ExpenseRepositoryImpl = withRepoLogging(
  "ExpenseRepositoryImpl",
  new ExpenseRepositoryBase(),
);
