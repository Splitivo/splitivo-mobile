import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthProvider, AuthSession } from "../../domain/entities/auth";
import { mockSignIn } from "../../data/datasources/mockAuthService";

interface AuthState {
  session: AuthSession | null;
  isLoading: boolean;
  error: string | null;
  signIn: (provider: AuthProvider) => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      isLoading: false,
      error: null,

      signIn: async (provider) => {
        set({ isLoading: true, error: null });
        try {
          const session = await mockSignIn(provider);
          set({ session, isLoading: false });
        } catch (e) {
          set({ error: (e as Error).message, isLoading: false });
        }
      },

      signOut: () => {
        set({ session: null, error: null });
      },
    }),
    {
      name: "auth-session",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ session: state.session }),
    },
  ),
);
