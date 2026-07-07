import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { resolveAccentColor } from "@/lib/utils/status";


export interface ProjectCardData {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  project_type: string;
  status_label: string | null;
  accent_color: string | null;
  cover_image_url: string | null;

  cover_image_alt_text: string | null;
  cover_image_position: string;
  tags: string[];
}

interface Props {
  project: ProjectCardData;
  variant?: "grid" | "detail";
  linkable?: boolean;
}

export function ProjectCard({ project, variant = "grid", linkable = true }: Props) {
  const accent = project.accent_color || "#65BFF1";
  const hasImage = !!project.cover_image_url;

  const inner = (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg bg-card transition-all",
        variant === "grid" && "h-full border border-border hover:shadow-lg",
        variant === "detail" && "border border-border",
      )}
    >
      {hasImage ? (
        <div className={cn("relative w-full overflow-hidden bg-muted", variant === "grid" ? "aspect-video" : "aspect-video md:aspect-[21/9]")}>
          <img
            src={project.cover_image_url!}
            alt={project.cover_image_alt_text || project.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
            style={{ objectPosition: project.cover_image_position || "center" }}
            loading="lazy"
          />
        </div>
      ) : (
        <div
          className="h-1.5 w-full"
          style={{ backgroundColor: accent }}
          aria-hidden
        />
      )}

      <div className={cn("flex flex-1 flex-col gap-3 p-5", variant === "detail" && "p-6 md:p-8")}>
        {project.status_label && (
          <span
            className="inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium"
            style={{ backgroundColor: `${accent}22`, color: project.project_type === "profil" ? "var(--foreground)" : accent }}
          >
            {project.status_label}
          </span>
        )}
        <h3
          className={cn(
            "font-serif font-bold leading-tight text-foreground",
            variant === "grid" ? "text-xl" : "text-3xl md:text-4xl",
          )}
        >
          {project.title}
        </h3>
        {project.tagline && (
          <p className={cn("text-muted-foreground", variant === "grid" ? "text-sm" : "text-base md:text-lg")}>
            {project.tagline}
          </p>
        )}
        {project.tags.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded border border-border bg-background px-2 py-0.5 text-xs text-foreground"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
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
