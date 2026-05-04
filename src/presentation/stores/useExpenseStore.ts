import { create } from "zustand";
import {
  Expense,
  CategoryBreakdown,
  TimePeriod,
} from "../../domain/entities/expense";
import { ExpenseRepositoryImpl } from "../../data/repositories/ExpenseRepositoryImpl";

interface ExpenseState {
  expenses: Expense[];
  categoryBreakdown: CategoryBreakdown[];
  selectedPeriod: TimePeriod;
  isLoading: boolean;
  error: string | null;

  setPeriod: (period: TimePeriod) => void;
  fetchAll: () => Promise<void>;
  // kept for external use if needed
  fetchExpenses: () => Promise<void>;
  fetchCategoryBreakdown: () => Promise<void>;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  categoryBreakdown: [],
  selectedPeriod: "monthly",
  isLoading: false,
  error: null,

  setPeriod: (period) => {
    set({
      selectedPeriod: period,
      isLoading: true,
      expenses: [],
      categoryBreakdown: [],
    });
    get().fetchAll();
  },

  fetchAll: async () => {
    const period = get().selectedPeriod;
    set({ isLoading: true, error: null });
    try {
      const [expenses, categoryBreakdown] = await Promise.all([
        ExpenseRepositoryImpl.getExpensesByPeriod(period),
        ExpenseRepositoryImpl.getCategoryBreakdown(period),
      ]);
      // Only commit if period hasn't changed while we were waiting
      if (get().selectedPeriod === period) {
        set({ expenses, categoryBreakdown, isLoading: false });
      }
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  fetchExpenses: async () => {
    set({ isLoading: true, error: null });
    try {
      const expenses = await ExpenseRepositoryImpl.getExpensesByPeriod(
        get().selectedPeriod,
      );
      set({ expenses, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  fetchCategoryBreakdown: async () => {
    try {
      const breakdown = await ExpenseRepositoryImpl.getCategoryBreakdown(
        get().selectedPeriod,
      );
      set({ categoryBreakdown: breakdown });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },
}));
