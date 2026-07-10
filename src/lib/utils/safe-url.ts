/**
 * Returns the URL only if it uses a safe http(s) protocol.
 * Prevents javascript:, data:, vbscript: and other protocol-based XSS.
 */
export function safeHref(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  return /^https?:\/\//i.test(trimmed) ? trimmed : undefined;
}
