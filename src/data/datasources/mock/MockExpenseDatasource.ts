import {
  Expense,
  CategoryBreakdown,
  TimePeriod,
} from "../../../domain/entities/expense";
import expensesData from "../../mocks/expenses.json";
import { simulateDelay } from "../../utils/delay";

export class MockExpenseDatasource {
  private expenses: Expense[] = expensesData as Expense[];

  async getExpenses(): Promise<Expense[]> {
    await simulateDelay();
    return this.expenses;
  }

  async getExpensesByPeriod(period: TimePeriod): Promise<Expense[]> {
    await simulateDelay();
    const now = new Date();
    return this.expenses.filter((e) => {
      const expDate = new Date(e.date);
      switch (period) {
        case "daily":
          return expDate.toDateString() === now.toDateString();
        case "monthly":
          return (
            expDate.getMonth() === now.getMonth() &&
            expDate.getFullYear() === now.getFullYear()
          );
        case "annually":
          return expDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  }

  async getCategoryBreakdown(period: TimePeriod): Promise<CategoryBreakdown[]> {
    const expenses = await this.getExpensesByPeriod(period);
    const categoryTotals = new Map<string, number>();

    expenses.forEach((e) => {
      categoryTotals.set(
        e.category,
        (categoryTotals.get(e.category) || 0) + e.amount,
      );
    });

    const total = Array.from(categoryTotals.values()).reduce(
      (a, b) => a + b,
      0,
    );

    return Array.from(categoryTotals.entries()).map(([category, amount]) => ({
      category: category as Expense["category"],
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }));
  }
}
