/**
 * Returns the URL only if it uses a safe http(s) protocol.
 * Prevents javascript:, data:, vbscript: and other protocol-based XSS.
 */
export function safeHref(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // Allow same-origin relative paths (e.g. /cv.pdf)
  if (/^\/[^/\\]/.test(trimmed)) return trimmed;
  return undefined;
}
