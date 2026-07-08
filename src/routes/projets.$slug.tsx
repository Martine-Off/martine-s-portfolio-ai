import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getProjectBySlug } from "@/lib/projects.functions";
import { getSiteSettings } from "@/lib/settings.functions";
import { ProjectCard } from "@/components/ProjectCard";
import { BlockRenderer } from "@/components/BlockRenderer";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageState } from "@/components/PageState";

const settingsQuery = queryOptions({ queryKey: ["site_settings"], queryFn: () => getSiteSettings() });

const projectQuery = (slug: string) =>
  queryOptions({
    queryKey: ["project", slug],
    queryFn: () => getProjectBySlug({ data: { slug } }),
  });

export const Route = createFileRoute("/projets/$slug")({
  head: ({ loaderData }) => {
    const p = (loaderData as { project?: { project: { title: string; tagline: string | null; cover_image_url: string | null } } } | undefined)?.project?.project;
    if (!p) {
      return {
        meta: [
          { title: "Projet introuvable" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const image = p.cover_image_url || "/og-default.jpg";
    return {
      meta: [
        { title: `${p.title} — Martine Desmaroux` },
        { name: "description", content: p.tagline ?? p.title },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.tagline ?? "" },
        { property: "og:type", content: "article" },
        { property: "og:image", content: image },
      ],
    };
  },
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(settingsQuery);
    const project = await context.queryClient.ensureQueryData(projectQuery(params.slug));
    if (!project) throw notFound();
    return { project };
  },
  component: ProjectPage,
  errorComponent: ({ error, reset }) => (
    <PageState
      variant="error"
      title="Impossible de charger ce projet"
      message={error.message}
      primary={{ label: "Réessayer", onClick: reset }}
      secondary={{ label: "Accueil", to: "/" }}
    />
  ),
  notFoundComponent: () => (
    <PageState
      variant="notfound"
      title="Projet introuvable"
      message="Ce projet n'existe pas ou n'est plus publié."
      primary={{ label: "Retour à l'accueil", to: "/" }}
    />
  ),
});


function ProjectPage() {
  const { slug } = Route.useParams();
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const { data } = useSuspenseQuery(projectQuery(slug));
  if (!data) return null;
  const { project, blocks } = data;

  const p = project as typeof project & { role: string | null; angle: string | null };
  type BlockWithTitle = (typeof blocks)[number] & { title: string | null };
  const tocItems = (blocks as BlockWithTitle[])
    .map((b) => {
      const label = b.block_type === "heading" ? (b.content ?? "").trim() : (b.title ?? "").trim();
      return label ? { id: `block-${b.id}`, label } : null;
    })
    .filter((x): x is { id: string; label: string } => x !== null);

  function onTocClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader heroTitle={settings?.hero_title ?? ""} />

      <div className="mx-auto max-w-4xl px-6 py-10">
        <Link to="/" className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground">
          ← Retour aux projets
        </Link>

        <ProjectCard
          project={{
            id: project.id,
            slug: project.slug,
            title: project.title,
            emoji: (project as { emoji?: string | null }).emoji ?? null,
            tagline: project.tagline,
            project_type: project.project_type,
            status_label: project.status_label,
            accent_color: project.accent_color,
            cover_image_url: project.cover_image_url,
            cover_image_alt_text: project.cover_image_alt_text,
            cover_image_position: project.cover_image_position,
            tags: project.tags,
          }}
          variant="detail"
          linkable={false}
        />

        {(p.role || p.angle) && (
          <div className="mt-4">
            {p.role && <p className="text-sm text-foreground">{p.role}</p>}
            {p.angle && <p className="text-xs text-muted-foreground">{p.angle}</p>}
          </div>
        )}

        {project.summary && (
          <p className="mt-8 text-lg leading-relaxed text-foreground">{project.summary}</p>
        )}

        {tocItems.length >= 2 && (
          <nav className="mt-8 rounded-lg border border-border bg-card p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Sommaire
            </p>
            <ul className="flex flex-wrap gap-2">
              {tocItems.map((t) => (
                <li key={t.id}>
                  
                    <a href={`#${t.id}`}
                    onClick={(e) => onTocClick(e, t.id)}
                    className="inline-block rounded-full border border-border bg-background px-3 py-1 text-xs text-accent hover:bg-accent/10 hover:underline"
                  >
                    {t.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="mt-8">
          {blocks.map((b) => (
            <BlockRenderer key={b.id} block={b as BlockWithTitle} />
          ))}
        </div>

        {project.repo_url ? (
          <div className="mt-10">
            
              <a href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              {project.repo_url.includes("github.com") ? "Voir le dépôt ↗" : "Voir le document ↗"}
            </a>
          </div>
        ) : project.repo_note ? (
          <p className="mt-10 text-sm italic text-muted-foreground">{project.repo_note}</p>
        ) : null}
      </div>

      <SiteFooter
        footerText={settings?.footer_text ?? ""}
        email={settings?.contact_email ?? ""}
        linkedinUrl={settings?.linkedin_url}
      />
    </div>
  );
}