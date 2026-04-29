import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthProvider, AuthSession } from "../../domain/entities/auth";
import {
  signInWithProvider,
  SignInCancelledError,
} from "../../services/auth/nativeAuthService";

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
          const session = await signInWithProvider(provider);
          set({ session, isLoading: false });
        } catch (e: unknown) {
          if (e instanceof SignInCancelledError) {
            // User dismissed the native sign-in sheet — not an error
            set({ isLoading: false });
            return;
          }
          set({
            error: (e as Error).message ?? "Sign in failed.",
            isLoading: false,
          });
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
