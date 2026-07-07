import { toEmbedUrl } from "@/lib/utils/video";

const LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

function renderInlineMarkdown(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  LINK_RE.lastIndex = 0;
  while ((match = LINK_RE.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    nodes.push(
      <a
        key={key++}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent underline"
      >
        {match[1]}
      </a>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}


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
              {renderInlineMarkdown(para)}
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
    case "liste": {
      const items = (block.content ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      if (items.length === 0) return null;
      return (
        <ul className="my-4 list-disc space-y-1 pl-6 text-base leading-relaxed text-foreground md:text-lg">
          {items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
    }
    case "comparatif": {
      const raw = block.content ?? "";
      const cols = raw.split("||").map((col) => {
        const [title, rest] = col.split(":");
        const items = (rest ?? "").split(",").map((s) => s.trim()).filter(Boolean);
        return { title: (title ?? "").trim(), items };
      });
      if (cols.length === 0) return null;
      return (
        <div className="my-6 grid gap-4 md:grid-cols-2">
          {cols.map((c, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-5">
              {c.title && <h4 className="mb-2 font-bold text-foreground">{c.title}</h4>}
              <ul className="list-disc space-y-1 pl-5 text-sm text-foreground md:text-base">
                {c.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    }
    default:
      return null;
  }
}


