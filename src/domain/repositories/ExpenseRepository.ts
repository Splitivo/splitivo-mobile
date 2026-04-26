import { Expense, CategoryBreakdown, TimePeriod } from "../entities/expense";

export interface ExpenseRepository {
  getExpenses(): Promise<Expense[]>;
  getExpensesByPeriod(period: TimePeriod): Promise<Expense[]>;
  getCategoryBreakdown(period: TimePeriod): Promise<CategoryBreakdown[]>;
}
