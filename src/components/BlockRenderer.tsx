import { toEmbedUrl } from "@/lib/utils/video";
import { renderInlineMarkdown } from "@/lib/utils/inline-markdown";

interface Block {
  id: string;
  block_type: string;
  title?: string | null;
  content: string | null;
  media_url: string | null;
  alt_text: string | null;
  caption: string | null;
}

function BlockTitle({ title, light }: { title?: string | null; light?: boolean }) {
  if (!title) return null;
  return (
    <h3 className={`mt-6 mb-2 font-serif text-base text-foreground md:text-lg ${light ? 'font-normal' : 'font-semibold'}`}>
      {title}
    </h3>
  );
}

export function BlockRenderer({ block }: { block: Block }) {
  const anchorId = `block-${block.id}`;
  switch (block.block_type) {
    case "heading":
      return (
        <h2 id={anchorId} className="mt-8 mb-2 scroll-mt-24 font-serif text-lg font-bold text-foreground md:text-xl">
          {block.content}
        </h2>
      );
    case "text":
      return (
        <div id={anchorId} className="scroll-mt-24 prose prose-neutral max-w-none text-foreground [&_p]:my-3 [&_p]:leading-relaxed">
          <BlockTitle title={block.title} />
          {block.content?.split("\n\n").map((para, i) => (
            <p key={i} className="text-base leading-relaxed text-foreground">
              {renderInlineMarkdown(para)}
            </p>
          ))}
        </div>
      );
    case "quote":
      return (
        <div id={anchorId} className="scroll-mt-24">
          <BlockTitle title={block.title} light />
          <blockquote
            className="my-6 border-l-4 pl-6 font-serif text-lg italic text-foreground md:text-xl"
            style={{ borderColor: "var(--decorative)" }}
          >
            {block.content ? renderInlineMarkdown(block.content) : null}
          </blockquote>
        </div>
      );
    case "image":
      if (!block.media_url) return null;
      return (
        <figure id={anchorId} className="my-6 scroll-mt-24">
          <BlockTitle title={block.title} />
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
          <p id={anchorId} className="my-4 scroll-mt-24 text-sm text-muted-foreground">
            Vidéo non prise en charge :{" "}
            <a href={block.media_url} className="text-accent underline">
              {block.media_url}
            </a>
          </p>
        );
      }
      return (
        <figure id={anchorId} className="my-6 scroll-mt-24">
          <BlockTitle title={block.title} />
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
        <div id={anchorId} className="scroll-mt-24">
          <BlockTitle title={block.title} />
          <ul className="my-4 list-disc space-y-1 pl-6 text-base leading-relaxed text-foreground">
            {items.map((it, i) => (
              <li key={i}>{renderInlineMarkdown(it)}</li>
            ))}
          </ul>
        </div>
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
        <div id={anchorId} className="scroll-mt-24">
          <BlockTitle title={block.title} />
          <div className="my-6 grid gap-4 md:grid-cols-2">
            {cols.map((c, i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-5">
                {c.title && <h4 className="mb-2 font-bold text-foreground">{c.title}</h4>}
                <ul className="list-disc space-y-1 pl-5 text-sm text-foreground md:text-base">
                  {c.items.map((it, j) => (
                    <li key={j}>{renderInlineMarkdown(it)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );
    }
    default:
      return null;
  }
}
