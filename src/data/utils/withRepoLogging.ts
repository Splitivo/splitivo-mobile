import { appConfig, Environment } from "../../core/config/environment";
import { useRepoLoggerStore } from "../../presentation/stores/useRepoLoggerStore";

/**
 * Wraps a repository class instance so every method call is logged to the
 * RepoLoggerStore. Only active in `dev` and `smoke` environments — in `prod`
 * the original instance is returned unchanged.
 */
export function withRepoLogging<T extends object>(
  repoClass: string,
  impl: T,
): T {
  if (appConfig.env === Environment.Prod) return impl;

  return new Proxy(impl, {
    get(target, prop, receiver) {
      const original = Reflect.get(target, prop, receiver);
      if (typeof original !== "function") return original;

      return async function (...args: unknown[]) {
        const start = Date.now();
        try {
          const result = await original.apply(target, args);
          useRepoLoggerStore.getState().addLog({
            repoClass,
            functionName: String(prop),
            parameters: args,
            response: result,
            timestamp: new Date(),
            durationMs: Date.now() - start,
          });
          return result;
        } catch (err) {
          useRepoLoggerStore.getState().addLog({
            repoClass,
            functionName: String(prop),
            parameters: args,
            response: null,
            error: err instanceof Error ? err.message : String(err),
            timestamp: new Date(),
            durationMs: Date.now() - start,
          });
          throw err;
        }
      };
    },
  });
}
