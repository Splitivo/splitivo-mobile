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
          // Re-resolve selectedCurrency from fresh list using persisted code,
          // falling back to IDR then first entry
          const persistedCode = get().selectedCurrency?.code ?? null;
          const selected =
            (persistedCode
              ? currencies.find((c) => c.code === persistedCode)
              : null) ??
            currencies.find((c) => c.code === "IDR") ??
            currencies[0] ??
            null;
          set({ currencies, selectedCurrency: selected, isLoading: false });
        } catch (e) {
          set({ error: (e as Error).message, isLoading: false });
        }
      },

      setCurrency: async (code) => {
        const all = get().currencies;
        const currency =
          all.find((c) => c.code === code.toUpperCase()) ??
          (await CurrencyRepositoryImpl.getByCode(code)) ??
          null;
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
