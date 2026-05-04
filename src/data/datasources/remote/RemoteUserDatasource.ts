import {
  buildUrl,
  ApiVersion,
  HttpMethod,
} from "../../../core/config/environment";
import { User, Participant } from "../../../domain/entities/user";

/**
 * Remote user datasource — will be activated when backend is ready.
 * Currently inactive; mock datasource is used instead.
 */
export class RemoteUserDatasource {
  async getCurrentUser(): Promise<User> {
    const { url, method } = buildUrl(ApiVersion.V1, "users/me");
    const res = await fetch(url, { method });
    return res.json();
  }

  async updateUser(update: Partial<User>): Promise<User> {
    const { url, method } = buildUrl(
      ApiVersion.V1,
      "users/me",
      HttpMethod.Patch,
    );
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    return res.json();
  }

  async searchParticipants(query: string): Promise<Participant[]> {
    const { url, method } = buildUrl(
      ApiVersion.V1,
      `users/search?q=${encodeURIComponent(query)}`,
    );
    const res = await fetch(url, { method });
    return res.json();
  }
}
