import { appConfig } from "../../../core/config/environment";
import { User, Participant } from "../../../domain/entities/user";

/**
 * Remote user datasource — will be activated when backend is ready.
 * Currently inactive; mock datasource is used instead.
 */
export class RemoteUserDatasource {
  private baseUrl = appConfig.apiUrl;

  async getCurrentUser(): Promise<User> {
    const res = await fetch(`${this.baseUrl}/users/me`);
    return res.json();
  }

  async updateUser(update: Partial<User>): Promise<User> {
    const res = await fetch(`${this.baseUrl}/users/me`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    return res.json();
  }

  async searchParticipants(query: string): Promise<Participant[]> {
    const res = await fetch(
      `${this.baseUrl}/users/search?q=${encodeURIComponent(query)}`,
    );
    return res.json();
  }
}
