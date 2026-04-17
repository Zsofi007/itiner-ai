type LogLevel = "info" | "warn" | "error";

function line(level: LogLevel, message: string): string {
  return `[itiner-ai:${level}] ${new Date().toISOString()} ${message}`;
}

export function logInfo(message: string, meta?: Record<string, unknown>): void {
  if (meta && Object.keys(meta).length > 0) {
    console.log(line("info", message), meta);
  } else {
    console.log(line("info", message));
  }
}

export function logWarn(message: string, meta?: Record<string, unknown>): void {
  if (meta && Object.keys(meta).length > 0) {
    console.warn(line("warn", message), meta);
  } else {
    console.warn(line("warn", message));
  }
}

export function logError(
  message: string,
  meta?: Record<string, unknown>,
): void {
  if (meta && Object.keys(meta).length > 0) {
    console.error(line("error", message), meta);
  } else {
    console.error(line("error", message));
  }
}
