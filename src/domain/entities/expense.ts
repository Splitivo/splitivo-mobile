export type ExpenseCategory =
  | "food_dining"
  | "entertainment"
  | "transport"
  | "shopping"
  | "groceries"
  | "utilities"
  | "other";

export type TimePeriod = "daily" | "monthly" | "annually";

export interface Expense {
  id: string;
  billId: string;
  merchantName: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  date: string;
}

export interface CategoryBreakdown {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
}
