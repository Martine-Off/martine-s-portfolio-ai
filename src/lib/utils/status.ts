export const STATUS_OPTIONS = [
  "Terminé",
  "Déployé",
  "MVP",
  "En production",
  "En cours",
] as const;

export type StatusLabel = (typeof STATUS_OPTIONS)[number] | string;

const GREEN = "#6DCFA8";
const BLUE = "#65BFF1";
const ORANGE = "#ECC28F";

export function getAutoAccentColor(status?: string | null): string {
  const s = (status ?? "").trim().toLowerCase();
  if (!s) return BLUE;
  if (s === "terminé" || s === "termine" || s === "déployé" || s === "deploye" || s === "en production") return GREEN;
  if (s === "mvp") return BLUE;
  if (s === "en cours") return ORANGE;
  return BLUE;
}

/** Returns the effective color: user-defined if set, otherwise derived from status. */
export function resolveAccentColor(accent: string | null | undefined, status: string | null | undefined): string {
  if (accent && accent.trim()) return accent;
  return getAutoAccentColor(status);
}
