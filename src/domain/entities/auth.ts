import { User } from "./user";

export type AuthProvider = "apple" | "google";

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  provider: AuthProvider;
  user: User;
}
