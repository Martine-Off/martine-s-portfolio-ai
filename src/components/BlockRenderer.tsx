import { toEmbedUrl } from "@/lib/utils/video";

interface Block {
  id: string;
  block_type: string;
  content: string | null;
  media_url: string | null;
  alt_text: string | null;
  caption: string | null;
}

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.block_type) {
    case "heading":
      return (
        <h2 className="mt-8 mb-2 font-serif text-2xl font-bold text-foreground md:text-3xl">
          {block.content}
        </h2>
      );
    case "text":
      return (
        <div className="prose prose-neutral max-w-none text-foreground [&_p]:my-3 [&_p]:leading-relaxed">
          {block.content?.split("\n\n").map((para, i) => (
            <p key={i} className="text-base leading-relaxed text-foreground md:text-lg">
              {para}
            </p>
          ))}
        </div>
      );
    case "quote":
      return (
        <blockquote
          className="my-6 border-l-4 pl-6 font-serif text-xl italic text-foreground md:text-2xl"
          style={{ borderColor: "var(--decorative)" }}
        >
          {block.content}
        </blockquote>
      );
    case "image":
      if (!block.media_url) return null;
      return (
        <figure className="my-6">
          <img
            src={block.media_url}
            alt={block.alt_text || ""}
            className="w-full rounded-lg border border-border"
            loading="lazy"
          />
          {block.caption && (
            <figcaption className="mt-2 text-sm text-muted-foreground">{block.caption}</figcaption>
          )}
        </figure>
      );
    case "video": {
      if (!block.media_url) return null;
      const embed = toEmbedUrl(block.media_url);
      if (!embed) {
        return (
          <p className="my-4 text-sm text-muted-foreground">
            Vidéo non prise en charge :{" "}
            <a href={block.media_url} className="text-accent underline">
              {block.media_url}
            </a>
          </p>
        );
      }
      return (
        <figure className="my-6">
          <div className="aspect-video w-full overflow-hidden rounded-lg border border-border bg-black">
            <iframe
              src={embed}
              title={block.alt_text || "Vidéo"}
              className="h-full w-full"
              allow="fullscreen; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
          {block.caption && (
            <figcaption className="mt-2 text-sm text-muted-foreground">{block.caption}</figcaption>
          )}
          {block.alt_text && (
            <p className="sr-only">{block.alt_text}</p>
          )}
        </figure>
      );
    }
    default:
      return null;
  }
}
