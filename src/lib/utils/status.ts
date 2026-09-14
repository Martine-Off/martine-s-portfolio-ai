export const STATUS_OPTIONS: string[] = [
  "Réalisée",
  "À venir",
  "POC",
  "MVP",
  "En production",
];

export type StatusLabel = string;

const GREEN = "#6DCFA8";
const BLUE = "#65BFF1";
const ORANGE = "#ECC28F";

export function getAutoAccentColor(status?: string | null): string {
  const s = (status ?? "").trim().toLowerCase();
  if (!s) return BLUE;
  const green = ["réalisée", "realisee", "déployé", "deploye", "production", "faite", "produit", "terminé", "termine"];
  const blue = ["mvp"];
  const orange = ["poc", "à venir", "a venir", "en cours", "cadrage", "audit"];
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
