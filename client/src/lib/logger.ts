/**
 * Trip / API debug logs. Enabled when:
 * - Vite dev server (`import.meta.env.DEV`), or
 * - `localStorage.setItem("itiner_debug", "1")` then refresh (production too).
 */
export function isItinerDebugEnabled(): boolean {
  if (import.meta.env.DEV) return true;
  try {
    return localStorage.getItem("itiner_debug") === "1";
  } catch {
    return false;
  }
}

export function itinerLog(
  scope: string,
  message: string,
  extra?: Record<string, unknown>,
): void {
  if (!isItinerDebugEnabled()) return;
  const tag = `[itiner:${scope}]`;
  if (extra !== undefined && Object.keys(extra).length > 0) {
    console.log(tag, message, extra);
  } else {
    console.log(tag, message);
  }
}

export function itinerWarn(
  scope: string,
  message: string,
  extra?: Record<string, unknown>,
): void {
  if (!isItinerDebugEnabled()) return;
  const tag = `[itiner:${scope}]`;
  if (extra !== undefined && Object.keys(extra).length > 0) {
    console.warn(tag, message, extra);
  } else {
    console.warn(tag, message);
  }
}

export function itinerError(
  scope: string,
  message: string,
  extra?: unknown,
): void {
  if (!isItinerDebugEnabled()) return;
  const tag = `[itiner:${scope}]`;
  if (extra !== undefined) {
    console.error(tag, message, extra);
  } else {
    console.error(tag, message);
  }
}
