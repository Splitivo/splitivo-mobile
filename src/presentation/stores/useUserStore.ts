import { create } from "zustand";
import { User, BankAccount } from "../../domain/entities/user";
import { UserRepositoryImpl } from "../../data/repositories/UserRepositoryImpl";

const userRepo = UserRepositoryImpl;

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  updateUser: (update: Partial<User>) => Promise<void>;
  addBankAccount: (account: Omit<BankAccount, "id">) => Promise<void>;
  removeBankAccount: (accountId: string) => Promise<void>;
  setDefaultBankAccount: (accountId: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await userRepo.getCurrentUser();
      set({ user, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  updateUser: async (update) => {
    set({ isLoading: true, error: null });
    try {
      const user = await userRepo.updateUser(update);
      set({ user, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  addBankAccount: async (account) => {
    const { user } = get();
    if (!user) return;
    const newAccount: BankAccount = { ...account, id: `ba${Date.now()}` };
    const updated = await userRepo.updateUser({
      bankAccounts: [...user.bankAccounts, newAccount],
    });
    set({ user: updated });
  },

  removeBankAccount: async (accountId) => {
    const { user } = get();
    if (!user) return;
    const updated = await userRepo.updateUser({
      bankAccounts: user.bankAccounts.filter((a) => a.id !== accountId),
    });
    set({ user: updated });
  },
  setDefaultBankAccount: async (accountId) => {
    const { user } = get();
    if (!user) return;
    const updated = await userRepo.updateUser({
      bankAccounts: user.bankAccounts.map((a) => ({
        ...a,
        isDefault: a.id === accountId,
      })),
    });
    set({ user: updated });
  },
}));
