/**
 * Convertit une URL vidéo (Loom, YouTube, Arcade) en URL embeddable.
 * Retourne null si l'URL n'est pas reconnue.
 */
export function toEmbedUrl(rawUrl: string): string | null {
  if (!rawUrl) return null;
  const url = rawUrl.trim();

  // Loom : https://www.loom.com/share/<id>
  const loom = url.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/);
  if (loom) return `https://www.loom.com/embed/${loom[1]}`;

  // YouTube
  const ytFull = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytFull) return `https://www.youtube.com/embed/${ytFull[1]}`;
  const ytEmbed = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (ytEmbed) return url;

  // Arcade
  if (url.includes("demo.arcade.software") || url.includes("app.arcade.software")) {
    return url;
  }

  return null;
}
