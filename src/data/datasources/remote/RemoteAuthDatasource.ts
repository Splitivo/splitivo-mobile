import {
  buildUrl,
  ApiVersion,
  HttpMethod,
} from "../../../core/config/environment";
import { AuthLoginData, AuthProvider } from "../../../domain/entities/auth";
import { HttpResp } from "../../../core/http";

export class RemoteAuthDatasource {
  async login(
    provider: AuthProvider,
    idToken: string,
  ): Promise<HttpResp<AuthLoginData>> {
    const { url, method } = buildUrl(
      ApiVersion.V1,
      `auth/login/${provider}`,
      HttpMethod.Post,
    );
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    const json: HttpResp<AuthLoginData> = await res.json();

    if (!res.ok) {
      throw new Error(json.message || `Login failed with status ${res.status}`);
    }

    return json;
  }

  async logout(refreshToken: string): Promise<void> {
    const { url, method } = buildUrl(
      ApiVersion.V1,
      "auth/logout",
      HttpMethod.Post,
    );
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
  }
}
