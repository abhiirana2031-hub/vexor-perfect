/**
 * Read env in Astro API routes / SSR: Vite exposes `.env` via `import.meta.env`;
 * scripts and some Node contexts use `process.env`.
 */
export function serverEnv(name: string): string | undefined {
  const raw = (import.meta.env as Record<string, string | undefined>)[name];
  if (raw?.trim()) return raw.trim();
  if (typeof process !== "undefined" && process.env[name]?.trim()) {
    return process.env[name]!.trim();
  }
  return undefined;
}
