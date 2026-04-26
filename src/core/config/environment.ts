export type Environment = "dev" | "smoke" | "prod";

export interface AppConfig {
  apiUrl: string;
  env: Environment;
  debugEnabled: boolean;
}

export const getAppConfig = (): AppConfig => {
  const env = (process.env.EXPO_PUBLIC_ENV as Environment) || "dev";
  return {
    apiUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api",
    env,
    debugEnabled: process.env.EXPO_PUBLIC_DEBUG_ENABLED === "true",
  };
};

export const appConfig = getAppConfig();
