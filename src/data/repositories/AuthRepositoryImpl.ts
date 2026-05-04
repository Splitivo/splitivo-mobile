import { AuthRepository } from "../../domain/repositories/AuthRepository";
import {
  AuthProvider,
  AuthSession,
  AuthLoginData,
} from "../../domain/entities/auth";
import { withRepoLogging } from "../utils/withRepoLogging";
import { RemoteAuthDatasource } from "../datasources/remote/RemoteAuthDatasource";
import { LocalAuthDatasource } from "../datasources/local/LocalAuthDatasource";

class AuthRepositoryBase implements AuthRepository {
  private readonly remote = new RemoteAuthDatasource();
  private readonly local = new LocalAuthDatasource();
  private mapToSession(
    provider: AuthProvider,
    data: AuthLoginData,
  ): AuthSession {
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      provider,
      user: {
        id: data.user.id,
        username: data.user.username,
        displayName: data.user.displayName,
        email: data.user.email ?? undefined,
        phone: data.user.phone ?? undefined,
        baseCurrency: data.user.baseCurrency,
        bankAccounts: [],
      },
      isNewUser: data.isNewUser,
      requiresProfileCompletion: data.requiresProfileCompletion,
    };
  }

  async loginWithGoogle(idToken: string): Promise<AuthSession> {
    const { data } = await this.remote.login("google", idToken);
    const session = this.mapToSession("google", data);
    await this.local.saveSession(session);
    return session;
  }

  async loginWithApple(idToken: string): Promise<AuthSession> {
    const { data } = await this.remote.login("apple", idToken);
    const session = this.mapToSession("apple", data);
    await this.local.saveSession(session);
    return session;
  }
}

export const AuthRepositoryImpl = withRepoLogging(
  "AuthRepositoryImpl",
  new AuthRepositoryBase(),
);
