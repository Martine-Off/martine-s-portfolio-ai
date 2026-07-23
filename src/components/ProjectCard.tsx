import { Link } from "@tanstack/react-router";
import { Box } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveAccentColor } from "@/lib/utils/status";


export interface ProjectCardData {
  id: string;
  slug: string;
  project_date?: string | null;
  title: string;
  emoji?: string | null;
  tagline: string | null;
  project_type: string;
  status_label: string | null;
  accent_color: string | null;
  cover_image_url: string | null;

  cover_image_alt_text: string | null;
  cover_image_position: string;
  tags: string[];
  impact?: string | null;
}

interface Props {
  project: ProjectCardData;
  variant?: "grid" | "detail";
  linkable?: boolean;
}

export function ProjectCard({ project, variant = "grid", linkable = true }: Props) {
  const accent = resolveAccentColor(project.accent_color, project.status_label);
  const hasImage = !!project.cover_image_url;


  const inner = (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg bg-card transition-all",
        variant === "grid" && "h-full border border-border hover:shadow-lg",
        variant === "detail" && "border border-border",
      )}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-[6px] z-10"
        style={{ backgroundColor: accent }}
      />
      {hasImage ? (
        <div className={cn("relative w-full overflow-hidden bg-muted", variant === "grid" ? "aspect-video" : "aspect-video md:aspect-[21/9]")}>
          <img
            src={project.cover_image_url!}
            alt={project.cover_image_alt_text || project.title.replace(/\|\|/g, " ").replace(/\s+/g, " ").trim()}
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
            style={{ objectPosition: project.cover_image_position || "center" }}
            loading="lazy"
          />
        </div>
      ) : (
        <div
          className={cn(
            "relative flex w-full items-center justify-center overflow-hidden bg-card",
            variant === "grid" ? "aspect-video" : "aspect-video md:aspect-[21/9]",
          )}
          style={{
            backgroundColor: `${accent}14`,
            borderBottom: `2px solid ${accent}`,
          }}
          aria-hidden
        >
          {project.emoji ? (
            <span className="text-5xl leading-none md:text-6xl">{project.emoji}</span>
          ) : (
            <Box className="opacity-40" size={64} strokeWidth={1.5} color={accent} />
          )}
        </div>
      )}

      <div className={cn("flex flex-1 flex-col gap-3", variant === "grid" ? "p-4" : "p-6 md:p-8")}>
        {(project.status_label || project.project_date) && (
          <div className={cn("flex w-full items-center gap-2", project.status_label ? "justify-between" : "justify-end")}>
            {project.status_label && (
              <span
                className="inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium"
                style={
                  !hasImage
                    ? { border: `2px solid ${accent}`, backgroundColor: "transparent", color: accent }
                    : { backgroundColor: `${accent}22`, color: project.project_type === "profil" ? "var(--foreground)" : accent }
                }
              >
                {project.status_label}
              </span>
            )}
            {project.project_date && (
              <p className={cn("shrink-0 font-medium text-muted-foreground/80 text-right", variant === "grid" ? "text-[11px]" : "text-xs")}>
                {project.project_date}
              </p>
            )}
          </div>
        )}
        <h3
          className={cn(
            "font-serif font-bold leading-tight text-foreground text-balance",
            variant === "grid" ? "text-lg" : "text-xl md:text-2xl",
          )}
        >
          {project.emoji ? <span className="mr-1.5">{project.emoji}</span> : null}
          {project.title.split("||").map((part, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {part.trim()}
            </span>
          ))}
        </h3>

        {project.tagline && (
          <p className={cn("text-muted-foreground", variant === "grid" ? "text-sm" : "text-sm md:text-base")}>
            {project.tagline}
          </p>
        )}
        {project.impact && (
          <p className={cn("font-normal flex items-start gap-1.5", variant === "grid" ? "text-sm" : "text-sm md:text-base")} style={{ color: "#1A1B2E" }}>
            <span aria-hidden="true">✓</span>
            <span>{project.impact}</span>
          </p>
        )}
        {project.tags.length > 0 && (() => {
          const visibleTags = variant === "grid" ? project.tags.slice(0, 4) : project.tags;
          const overflow = variant === "grid" ? project.tags.length - 4 : 0;
          return (
            <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
              {visibleTags.map((tag) => (
                <li
                  key={tag}
                  className={cn(
                    "rounded px-2 py-0.5 text-xs text-foreground",
                    !hasImage ? "bg-muted" : "border border-border bg-background"
                  )}
                >
                  {tag}
                </li>
              ))}
              {overflow > 0 && (
                <li
                  className="rounded px-2 py-0.5 text-xs text-muted-foreground/70 border border-border/50 bg-muted/50"
                  aria-label={`${overflow} tags supplémentaires`}
                >
                  +{overflow}
                </li>
              )}
            </ul>
          );
        })()}
      </div>
    </article>
  );

  if (!linkable) return inner;
  return (
    <Link
      to="/projets/$slug"
      params={{ slug: project.slug }}
      className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-lg"
    >
      {inner}
    </Link>
  );
}
