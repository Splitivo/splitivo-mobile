import { appConfig, Environment } from "../../core/config/environment";
import {
  useLoggerStore,
  LogLevel,
} from "../../presentation/stores/useLoggerStore";

function log(level: LogLevel, tag: string | undefined, messages: unknown[]) {
  // Always forward to the native console
  const prefix = tag ? `[${tag}]` : "";
  const consoleFn =
    level === "error"
      ? console.error
      : level === "warn"
        ? console.warn
        : level === "info"
          ? console.info
          : console.log;

  const formatted = messages.map((m) =>
    m !== null && typeof m === "object" ? JSON.stringify(m, null, 2) : m,
  );
  consoleFn(prefix, ...formatted);

  // Store in the sheet only for dev/smoke
  if (appConfig.env === Environment.Prod) return;

  useLoggerStore.getState().addLog({
    level,
    tag,
    messages,
    timestamp: new Date(),
  });
}

/**
 * Drop-in replacement for console.log that also surfaces logs in the
 * Debug Bottom Sheet → Logger page (dev/smoke only).
 *
 * Usage:
 *   Logger.log("hello", someObject)
 *   Logger.tag("Auth").info("signed in", user)
 *   Logger.warn("something fishy")
 *   Logger.error("boom", err)
 */
export const Logger = {
  log: (...messages: unknown[]) => log("log", undefined, messages),
  info: (...messages: unknown[]) => log("info", undefined, messages),
  warn: (...messages: unknown[]) => log("warn", undefined, messages),
  error: (...messages: unknown[]) => log("error", undefined, messages),

  /** Returns a tagged sub-logger: Logger.tag("Auth").info("...") */
  tag: (tag: string) => ({
    log: (...messages: unknown[]) => log("log", tag, messages),
    info: (...messages: unknown[]) => log("info", tag, messages),
    warn: (...messages: unknown[]) => log("warn", tag, messages),
    error: (...messages: unknown[]) => log("error", tag, messages),
  }),
};
