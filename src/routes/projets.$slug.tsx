import { useState } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getProjectBySlug } from "@/lib/projects.functions";
import { getSiteSettings } from "@/lib/settings.functions";
import { ProjectCard } from "@/components/ProjectCard";
import { BlockRenderer } from "@/components/BlockRenderer";
import { ProjectToc } from "@/components/ProjectToc";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageState } from "@/components/PageState";
import { safeHref } from "@/lib/utils/safe-url";


const settingsQuery = queryOptions({ queryKey: ["site_settings"], queryFn: () => getSiteSettings() });

const projectQuery = (slug: string) =>
  queryOptions({
    queryKey: ["project", slug],
    queryFn: () => getProjectBySlug({ data: { slug } }),
  });

const FRENCH_MONTHS: Record<string, string> = {
  janvier: "01", février: "02", fevrier: "02", mars: "03", avril: "04",
  mai: "05", juin: "06", juillet: "07", août: "08", aout: "08",
  septembre: "09", octobre: "10", novembre: "11", décembre: "12", decembre: "12",
};

// project_date is free text ("période : janvier – juin 2026", "octobre 2025", "depuis novembre 2025"...).
// Convert the common "mois année" / "mois année – mois année" shapes to an ISO 8601
// date or interval for temporalCoverage; fall back to the raw trimmed text otherwise
// so the property is still populated even when the pattern doesn't match.
function projectDateToTemporalCoverage(raw: string): string {
  const cleaned = raw.replace(/^\s*(période|periode|depuis)\s*:?\s*/i, "").trim();
  const monthYear = (m: string, y: string) => `${y}-${FRENCH_MONTHS[m.toLowerCase()]}`;
  const rangeCrossYear = cleaned.match(/^(\p{L}+)\s+(\d{4})\s*[–-]\s*(\p{L}+)\s+(\d{4})$/u);
  if (rangeCrossYear && FRENCH_MONTHS[rangeCrossYear[1].toLowerCase()] && FRENCH_MONTHS[rangeCrossYear[3].toLowerCase()]) {
    return `${monthYear(rangeCrossYear[1], rangeCrossYear[2])}/${monthYear(rangeCrossYear[3], rangeCrossYear[4])}`;
  }
  const rangeSameYear = cleaned.match(/^(\p{L}+)\s*[–-]\s*(\p{L}+)\s+(\d{4})$/u);
  if (rangeSameYear && FRENCH_MONTHS[rangeSameYear[1].toLowerCase()] && FRENCH_MONTHS[rangeSameYear[2].toLowerCase()]) {
    return `${monthYear(rangeSameYear[1], rangeSameYear[3])}/${monthYear(rangeSameYear[2], rangeSameYear[3])}`;
  }
  const single = cleaned.match(/^(\p{L}+)\s+(\d{4})$/u);
  if (single && FRENCH_MONTHS[single[1].toLowerCase()]) {
    return monthYear(single[1], single[2]);
  }
  return cleaned;
}

type ProjectHeadData = {
  title: string;
  tagline: string | null;
  cover_image_url: string | null;
  tags: string[];
  project_date: string | null;
};

interface SchemaCreativeWork {
  "@context": "https://schema.org";
  "@type": "CreativeWork";
  name: string;
  headline: string;
  image: string;
  author: {
    "@type": "Person";
    name: string;
  };
  url: string;
}

export const Route = createFileRoute("/projets/$slug")({
  head: ({ loaderData, params }: any) => {
    const p = (loaderData as { project?: { project: ProjectHeadData } } | undefined)?.project?.project;
    if (!p) {
      return {
        meta: [
          { title: "Projet introuvable" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const image = p.cover_image_url || "/og-default.jpg";
    const cleanTitle = p.title.replace(/\|\|/g, " ").replace(/\s+/g, " ").trim();
    
    const projectSchema: SchemaCreativeWork = {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: cleanTitle,
      headline: p.tagline || cleanTitle,
      image: p.cover_image_url || "https://martine-ia.lovable.app/og-default.jpg",
      author: {
        "@type": "Person",
        name: "Martine Desmaroux"
      },
      url: `https://martine-ia.lovable.app/projets/${params.slug}`
    };
    return {
      meta: [
        { title: `${cleanTitle} — Martine Desmaroux` },
        { name: "description", content: p.tagline ?? cleanTitle },
        { property: "og:title", content: cleanTitle },
        { property: "og:description", content: p.tagline ?? "" },
        { property: "og:type", content: "article" },
        { property: "og:image", content: image },
      ],
      links: [{ rel: "canonical", href: `https://martine-ia.lovable.app/projets/${params.slug}` }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(projectSchema) }],
    };
  },
  loader: async ({ context, params }: any) => {
    await context.queryClient.ensureQueryData(settingsQuery);
    const project = await context.queryClient.ensureQueryData(projectQuery(params.slug));
    if (!project) throw notFound();
    return { project };
  },
  component: ProjectPage,
  errorComponent: ({ error, reset }: any) => (
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

  const categorised = project.tags_categorises as { label: string; items: string[] }[] | null;

  const [tocOpen, setTocOpen] = useState(false);

  function onTocClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }
    setTocOpen(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader
        heroTitle={settings?.hero_title ?? ""}
        linkedinUrl={settings?.linkedin_url?.trim() ?? null}
      />

      <div className="mx-auto max-w-[76.5rem] px-6 py-10">
        <div className="xl:grid xl:grid-cols-[minmax(0,56rem)_240px] xl:items-start xl:gap-10">
          <div className="mx-auto w-full max-w-4xl xl:mx-0 xl:max-w-none">
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
                project_date: project.project_date,
                status_label: project.status_label,
                accent_color: project.accent_color,
                cover_image_url: project.cover_image_url,
                cover_image_alt_text: project.cover_image_alt_text,
                cover_image_position: project.cover_image_position,
                tags: project.tags,
                impact: project.impact,
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

            {tocItems.length >= 2 && (
              <nav className="mt-8 rounded-lg border border-border bg-card xl:hidden" aria-label="Sommaire">
                <button
                  type="button"
                  onClick={() => setTocOpen((v) => !v)}
                  className="flex w-full items-center justify-between px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground"
                  aria-expanded={tocOpen}
                >
                  <span>Sommaire</span>
                  <span
                    className="ml-2 transition-transform duration-200"
                    style={{ display: "inline-block", transform: tocOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                </button>
                {tocOpen && (
                  <ul className="border-t border-border px-4 pb-3 pt-2">
                    {tocItems.map((t) => (
                      <li key={t.id}>
                        <a
                          href={`#${t.id}`}
                          onClick={(e) => onTocClick(e, t.id)}
                          className="block border-l-2 border-border py-1.5 pl-3 text-sm leading-snug text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                        >
                          {t.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </nav>
            )}

            <div className="mt-8">
              {blocks.map((b: any) => (
                <BlockRenderer key={b.id} block={b as BlockWithTitle} />
              ))}
            </div>

            {categorised && categorised.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-6 font-serif text-xl font-bold text-foreground md:text-2xl">Outils et compétences</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {categorised.map((block, i) => (
                    <div key={i} className="rounded-lg border border-border bg-card p-5">
                      <h3 className="mb-3 font-serif text-base font-bold text-foreground">{block.label}</h3>
                      <ul className="flex flex-wrap gap-1.5">
                        {block.items.map((item, j) => (
                          <li key={j} className="rounded border border-border bg-background px-2 py-0.5 text-xs text-foreground">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(() => {
              const safeRepo = safeHref(project.repo_url);
              return safeRepo ? (
              <div className="mt-10">
                <a href={safeRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  {project.repo_label?.trim()
                    ? project.repo_label.trim()
                    : safeRepo.includes("github.com")
                    ? "Voir le dépôt ↗"
                    : "Voir le document ↗"}
                </a>
              </div>
            ) : project.repo_note ? (
              <p className="mt-10 text-sm italic text-muted-foreground">{project.repo_note}</p>
            ) : null;
            })()}

          </div>

          <ProjectToc sections={tocItems} className="hidden xl:block" />
        </div>
      </div>

      <SiteFooter
        footerText={settings?.footer_text ?? ""}
        email={settings?.contact_email?.trim() ?? ""}
        linkedinUrl={settings?.linkedin_url?.trim() ?? null}
      />
    </div>
  );
}