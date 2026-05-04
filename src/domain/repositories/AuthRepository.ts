import { AuthProvider, AuthSession } from "../entities/auth";

export interface AuthRepository {
  loginWithGoogle(idToken: string): Promise<AuthSession>;
  loginWithApple(idToken: string): Promise<AuthSession>;
  logout(refreshToken: string): Promise<void>;
}
