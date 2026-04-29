import { AuthProvider, AuthSession } from "../../domain/entities/auth";
import mockResponses from "../mocks/auth-response.json";

/** Simulates a POST /auth/:provider network call with 800ms latency. */
export async function mockSignIn(provider: AuthProvider): Promise<AuthSession> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const response = mockResponses[provider] as AuthSession;
  if (!response) throw new Error(`No mock response for provider: ${provider}`);
  return response;
}
