import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Currency } from "../../domain/entities/currency";
import { CurrencyRepositoryImpl } from "../../data/repositories/CurrencyRepositoryImpl";

interface CurrencyState {
  currencies: Currency[];
  selectedCurrency: Currency | null;
  searchResults: Currency[];
  isLoading: boolean;
  error: string | null;

  fetchCurrencies: () => Promise<void>;
  setCurrency: (code: string) => Promise<void>;
  searchCurrencies: (query: string) => Promise<void>;
  clearSearch: () => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currencies: [],
      selectedCurrency: null,
      searchResults: [],
      isLoading: false,
      error: null,

      fetchCurrencies: async () => {
        set({ isLoading: true, error: null });
        try {
          const currencies = await CurrencyRepositoryImpl.getAll();
          // Only set default if nothing was persisted
          const selected =
            get().selectedCurrency ??
            currencies.find((c) => c.code === "USD") ??
            null;
          set({ currencies, selectedCurrency: selected, isLoading: false });
        } catch (e) {
          set({ error: (e as Error).message, isLoading: false });
        }
      },

      setCurrency: async (code) => {
        const currency = await CurrencyRepositoryImpl.getByCode(code);
        if (currency) {
          set({ selectedCurrency: currency });
        }
      },

      searchCurrencies: async (query) => {
        if (!query.trim()) {
          set({ searchResults: [] });
          return;
        }
        const results = await CurrencyRepositoryImpl.search(query);
        set({ searchResults: results });
      },

      clearSearch: () => set({ searchResults: [] }),
    }),
    {
      name: "splitivo-base-currency",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ selectedCurrency: state.selectedCurrency }),
    },
  ),
);
