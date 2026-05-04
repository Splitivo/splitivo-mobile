export enum Environment {
  Dev = "dev",
  Smoke = "smoke",
  Prod = "prod",
}

export enum ApiVersion {
  V1 = "v1",
  V2 = "v2",
}

export enum HttpMethod {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Patch = "PATCH",
  Delete = "DELETE",
}

export interface AppConfig {
  apiUrl: string;
  env: Environment;
  debugEnabled: boolean;
}

export const getAppConfig = (): AppConfig => {
  const env = (process.env.EXPO_PUBLIC_ENV as Environment) || Environment.Dev;
  return {
    apiUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api",
    env,
    debugEnabled: process.env.EXPO_PUBLIC_DEBUG_ENABLED === "true",
  };
};

export const appConfig = getAppConfig();

export const buildUrl = (
  version: ApiVersion,
  path: string,
  method: HttpMethod = HttpMethod.Get,
): { url: string; method: HttpMethod } => {
  return { url: `${appConfig.apiUrl}/${version}/${path}`, method };
};
