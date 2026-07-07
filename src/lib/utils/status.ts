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
  const green = ["déployé", "deploye", "production", "faite", "produit", "terminé", "termine"];
  const blue = ["mvp"];
  const orange = ["poc", "en cours", "cadrage", "audit"];
  for (const kw of green) if (s.includes(kw)) return GREEN;
  for (const kw of blue) if (s.includes(kw)) return BLUE;
  for (const kw of orange) if (s.includes(kw)) return ORANGE;
  return BLUE;
}

/** Returns the effective color: user-defined if set, otherwise derived from status. */
export function resolveAccentColor(accent: string | null | undefined, status: string | null | undefined): string {
  if (accent && accent.trim()) return accent;
  return getAutoAccentColor(status);
}
