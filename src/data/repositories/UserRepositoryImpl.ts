import {
  UserRepository,
  CompleteProfilePayload,
} from "../../domain/repositories/UserRepository";
import { User, Participant } from "../../domain/entities/user";
import { MockUserDatasource } from "../datasources/mock/MockUserDatasource";
import { withRepoLogging } from "../utils/withRepoLogging";
import {
  buildUrl,
  ApiVersion,
  HttpMethod,
} from "../../core/config/environment";
import { HttpResp } from "../../core/http";
import { useAuthStore } from "../../presentation/stores/useAuthStore";

class UserRepositoryBase implements UserRepository {
  private readonly datasource = new MockUserDatasource();
  async getCurrentUser(): Promise<User> {
    return this.datasource.getCurrentUser();
  }

  async updateUser(user: Partial<User>): Promise<User> {
    return this.datasource.updateUser(user);
  }

  async searchParticipants(query: string): Promise<Participant[]> {
    return this.datasource.searchParticipants(query);
  }

  async completeProfile(payload: CompleteProfilePayload): Promise<User> {
    const token = useAuthStore.getState().session?.accessToken;
    const { url, method } = buildUrl(
      ApiVersion.V1,
      "users/me/complete-profile",
      HttpMethod.Patch,
    );
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    const json: HttpResp<{
      uid: string;
      username: string;
      display_name: string;
      email: string;
      phone?: string;
      avatar_url: string | null;
      base_currency_id: number;
      base_currency: { id: number; uid: string; code: string; name: string };
    }> = await res.json();
    if (!res.ok) throw new Error(json.message || `Error ${res.status}`);
    const d = json.data;
    return {
      id: d.uid,
      username: d.username,
      displayName: d.display_name,
      email: d.email,
      phone: d.phone,
      avatarUrl: d.avatar_url ?? undefined,
      baseCurrency: d.base_currency.code,
      bankAccounts: [],
    };
  }
}

export const UserRepositoryImpl = withRepoLogging(
  "UserRepositoryImpl",
  new UserRepositoryBase(),
);
