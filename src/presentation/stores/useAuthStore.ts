import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthProvider, AuthSession } from "../../domain/entities/auth";
import {
  signInWithProvider,
  SignInCancelledError,
} from "../../services/auth/nativeAuthService";

import { AuthRepositoryImpl } from "../../data/repositories/AuthRepositoryImpl";

interface AuthState {
  session: AuthSession | null;
  isLoading: boolean;
  isSigningOut: boolean;
  error: string | null;
  signIn: (provider: AuthProvider) => Promise<void>;
  signOut: () => Promise<void>;
  markProfileComplete: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      isLoading: false,
      isSigningOut: false,
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

      markProfileComplete: () => {
        set((state) => ({
          session: state.session
            ? { ...state.session, requiresProfileCompletion: false }
            : null,
        }));
      },

      signOut: async () => {
        set({ isSigningOut: true });
        try {
          const session = useAuthStore.getState().session;
          if (session) {
            await AuthRepositoryImpl.logout(session.refreshToken);
          }
        } finally {
          set({ session: null, error: null, isSigningOut: false });
        }
      },
    }),
    {
      name: "auth-session",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ session: state.session }),
    },
  ),
);
