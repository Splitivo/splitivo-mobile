import { User } from "./user";

export type AuthProvider = "apple" | "google";

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  provider: AuthProvider;
  user: User;
  isNewUser: boolean;
  requiresProfileCompletion: boolean;
}

/** Shape of `data` inside the backend's login response */
export interface AuthLoginData {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    email: string | null;
    phone: string | null;
    baseCurrency: string;
  };
  isNewUser: boolean;
  requiresProfileCompletion: boolean;
}
