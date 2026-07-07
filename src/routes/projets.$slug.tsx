import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getProjectBySlug } from "@/lib/projects.functions";
import { getSiteSettings } from "@/lib/settings.functions";
import { ProjectCard } from "@/components/ProjectCard";
import { BlockRenderer } from "@/components/BlockRenderer";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const settingsQuery = queryOptions({ queryKey: ["site_settings"], queryFn: () => getSiteSettings() });

const projectQuery = (slug: string) =>
  queryOptions({
    queryKey: ["project", slug],
    queryFn: () => getProjectBySlug({ data: { slug } }),
  });

export const Route = createFileRoute("/projets/$slug")({
  head: ({ loaderData }) => {
    const p = (loaderData as { project?: { project: { title: string; tagline: string | null; cover_image_url: string | null } } } | undefined)?.project?.project;
    if (!p) return { meta: [{ title: "Projet introuvable" }] };
    return {
      meta: [
        { title: `${p.title} — Martine Desmaroux` },
        { name: "description", content: p.tagline ?? p.title },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.tagline ?? "" },
        ...(p.cover_image_url ? [{ property: "og:image", content: p.cover_image_url }] : []),
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
  errorComponent: ({ error }) => <div className="p-8">{error.message}</div>,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="font-serif text-4xl text-foreground">Projet introuvable</h1>
        <Link to="/" className="mt-4 inline-block text-accent hover:underline">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  ),
});

function ProjectPage() {
  const { slug } = Route.useParams();
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const { data } = useSuspenseQuery(projectQuery(slug));
  if (!data) return null;
  const { project, blocks } = data;

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

        {project.summary && (
          <p className="mt-8 text-lg leading-relaxed text-foreground">{project.summary}</p>
        )}

        <div className="mt-8">
          {blocks.map((b) => (
            <BlockRenderer key={b.id} block={b} />
          ))}
        </div>

        {project.external_url && (
          <div className="mt-10">
            <a
              href={project.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Voir le projet ↗
            </a>
          </div>
        )}
      </div>

      <SiteFooter
        footerText={settings?.footer_text ?? ""}
        email={settings?.contact_email ?? ""}
        linkedinUrl={settings?.linkedin_url}
      />
    </div>
  );
}
