import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getSiteSettings } from "@/lib/settings.functions";
import { listPublishedProjects, getProfilePage } from "@/lib/projects.functions";
import { ProjectCard } from "@/components/ProjectCard";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageState } from "@/components/PageState";
import { QuickNav, type QuickNavSection } from "@/components/QuickNav";
import { BackToTop } from "@/components/BackToTop";
import { cn } from "@/lib/utils";
import { renderInlineMarkdown } from "@/lib/utils/inline-markdown";
import { safeHref } from "@/lib/utils/safe-url";

const settingsQuery = queryOptions({ queryKey: ["site_settings"], queryFn: () => getSiteSettings() });
const projectsQuery = queryOptions({ queryKey: ["projects", "public"], queryFn: () => listPublishedProjects() });
const profileQuery = queryOptions({ queryKey: ["profile"], queryFn: () => getProfilePage() });

const HOME_DESCRIPTION =
  "Portfolio de Martine Desmaroux, cheffe de projet IA. Projets d'automatisation, POCs, formations et missions IA.";

interface SchemaPerson {
  "@context": "https://schema.org";
  "@type": "Person";
  name: string;
  url: string;
  jobTitle: string;
  description: string;
  sameAs: string[];
}

export const Route = createFileRoute("/")({
  head: ({ loaderData }: any) => {
    const data = loaderData as { jobTitle: string | null; linkedinUrl: string | null } | undefined;

    const personSchema: SchemaPerson = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Martine Desmaroux",
      url: "https://martine-ia.lovable.app",
      jobTitle: data?.jobTitle || "Cheffe de projet IA",
      description: HOME_DESCRIPTION,
      sameAs: data?.linkedinUrl
        ? [data.linkedinUrl]
        : ["https://www.linkedin.com/in/martine-desmaroux-b3ba58160/"]
    };
    return {
      meta: [
        { title: "Martine Desmaroux - Cheffe de projet IA" },
        { name: "description", content: HOME_DESCRIPTION },
        { property: "og:title", content: "Martine Desmaroux - Cheffe de projet IA" },
        { property: "og:description", content: HOME_DESCRIPTION },
        { property: "og:type", content: "website" },
        { property: "og:image", content: "/og-default.jpg" },
      ],
      links: [{ rel: "canonical", href: "https://martine-ia.lovable.app/" }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(personSchema) }],
    };
  },
  loader: async ({ context }: any) => {
    await Promise.all([
      context.queryClient.ensureQueryData(settingsQuery),
      context.queryClient.ensureQueryData(projectsQuery),
      context.queryClient.ensureQueryData(profileQuery),
    ]);
    const settings = context.queryClient.getQueryData(["site_settings"]) as Awaited<ReturnType<typeof getSiteSettings>> | undefined;
    return {
      jobTitle: settings?.hero_subtitle ?? null,
      linkedinUrl: settings?.linkedin_url?.trim() || null,
      cvUrl: settings?.cv_url?.trim() || null,
    };

  },
  component: HomePage,
  errorComponent: ({ error, reset }: any) => (
    <PageState
      variant="error"
      title="Impossible de charger l'accueil"
      message={error.message}
      primary={{ label: "Réessayer", onClick: reset }}
    />
  ),
  notFoundComponent: () => (
    <PageState variant="notfound" title="Page introuvable" primary={{ label: "Retour à l'accueil", to: "/" }} />
  ),
});


type CondensedItem = {
  id: string;
  title: string;
  tagline: string | null;
  slug: string;
  role: string | null;
  angle: string | null;
  status_label: string | null;
  project_date: string | null;
  tags: string[];
  impact: string | null;
  cover_image_url: string | null;
  cover_image_alt_text: string | null;
  repo_url: string | null;
  repo_label: string | null;
};

function CondensedItemRow({ p }: { p: CondensedItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li className="px-4 py-1.5 md:px-5 md:py-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {p.cover_image_url && (
            <img
              src={p.cover_image_url}
              alt={p.cover_image_alt_text || p.title.replace(/\|\|/g, " ").replace(/\s+/g, " ").trim()}
              className="mt-2 h-10 w-10 shrink-0 rounded-md border border-border object-cover md:h-12 md:w-12"
              loading="lazy"
            />
          )}
          <div
            className="flex flex-wrap items-baseline gap-x-2 gap-y-1 py-2 cursor-pointer flex-1 min-w-0"
            onClick={() => setIsOpen(!isOpen)}
          >
            <h3 className="font-serif text-base font-bold text-foreground">
              {p.title.split("||").map((part, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {part.trim()}
                </span>
              ))}
            </h3>
            {p.role && <span className="text-sm text-muted-foreground">— {p.role}</span>}
            {(p.status_label || p.project_date) && (
              <span className="inline-flex shrink-0 items-center gap-x-2 whitespace-nowrap">
                {p.status_label && (
                  <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground">
                    {p.status_label}
                  </span>
                )}
                {p.project_date && (
                  <span className="text-[11px] text-[#5F5A85]">
                    · {p.project_date}
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex min-h-[44px] shrink-0 items-center justify-end px-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          aria-expanded={isOpen}
        >
          {isOpen ? "Lire moins" : "Lire plus"}
        </button>
      </div>

      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-3 pt-1">
            {p.tagline && <p className="text-sm text-muted-foreground">{p.tagline}</p>}
            {p.tags.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-1">
                {p.tags.map((t) => (
                  <li key={t} className="rounded border border-border bg-background px-1.5 py-0.5 text-[11px] text-foreground">
                    {t}
                  </li>
                ))}
              </ul>
            )}
            {p.impact && <p className="mt-2 text-sm text-foreground">{p.impact}</p>}
            {p.repo_url && (
              <a
                href={p.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-muted"
              >
                {p.repo_label?.trim() || "Voir ↗"}
              </a>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

function CondensedList({ id, title, items }: { id: string; title: string; items: CondensedItem[] }) {
  if (items.length === 0) return null;
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-20 px-6 py-10 md:py-14">
      <h2 className="mb-4 font-serif text-xl font-bold text-foreground md:mb-6 md:text-2xl">{title}</h2>
      <ul className="divide-y divide-border rounded-lg border border-border bg-card">
        {items.map((p) => (
          <CondensedItemRow key={p.id} p={p} />
        ))}
      </ul>
    </section>
  );
}



function HomePage() {
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const { data: profile } = useSuspenseQuery(profileQuery);

  const photoUrl = profile?.project.photo_profil_url;
  const photoAlt = profile?.project.photo_profil_alt_text;

  const featured = projects.filter(
    (p: any) =>
      p.project_type === "poc_perso" ||
      p.project_type === "production_client" ||
      p.project_type === "poc_ecole",
  );
  const formations = projects.filter(
    (p: any) => p.project_type === "formation_mission" && p.mission_type === "formation",
  );
  const missions = projects.filter(
    (p: any) => p.project_type === "formation_mission" && (p.mission_type === "mission" || p.mission_type === null),
  );
  const benevolat = projects.filter(
    (p: any) => p.project_type === "formation_mission" && p.mission_type === "benevolat",
  );
  const toolsRaw = (settings?.tools_json ?? []) as Array<{ category: string; items: { name: string; show_on_home: boolean }[] }>;
  const tools = toolsRaw
    .map((cat) => ({
      category: cat.category,
      items: cat.items.filter((i) => i.show_on_home).map((i) => i.name),
    }))
    .filter((cat) => cat.items.length > 0);
  const toolsFlat = tools.flatMap((cat) => cat.items);
  const linkedinUrl = safeHref(settings?.linkedin_url?.trim() || null);
  const cvUrl = safeHref((settings as any)?.cv_url?.trim() || null);
  const contactEmail = settings?.contact_email?.trim() || null;
  const hasContact = Boolean(linkedinUrl || cvUrl || contactEmail);

  const navSections: QuickNavSection[] = [
    featured.length > 0 && { id: "projets-phares", label: "Projets" },
    formations.length > 0 && { id: "formations", label: "Formations" },
    missions.length > 0 && { id: "missions", label: "Missions" },
    benevolat.length > 0 && { id: "benevolat", label: "Bénévolat" },
    tools.length > 0 && { id: "outils", label: "Outils" },
    hasContact && { id: "contact", label: "Contact" },
  ].filter((s): s is QuickNavSection => Boolean(s));

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader
        heroTitle={settings?.hero_title ?? "Martine Desmaroux"}
        linkedinUrl={settings?.linkedin_url?.trim() ?? null}
      />
      <QuickNav sections={navSections} />

      {/* Hero */}
      <section id="hero" className="relative overflow-hidden border-b border-border">
        {settings?.cover_image_url && (
          <div className="absolute inset-0 z-0">
            <img
              src={settings.cover_image_url}
              alt={settings.cover_image_alt_text || settings.hero_title || ""}
              className="h-full w-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80" />
          </div>
        )}
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="border-l-4 border-accent pl-6 md:pl-8">
            {(settings?.hero_subtitle || settings?.location) && (
              <span className="mb-4 inline-block rounded-full bg-accent px-3 py-1 text-sm font-bold uppercase tracking-widest text-foreground">
                {[settings?.hero_subtitle, settings?.location].filter(Boolean).join(" · ")}
              </span>
            )}
            <h1 className="font-serif text-2xl font-bold leading-tight text-foreground md:text-4xl">
              {settings?.hero_title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-normal text-muted-foreground">
              {settings?.hero_intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {settings?.linkedin_url ? (
                <a
                  href={safeHref(settings.linkedin_url) || settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Me contacter sur LinkedIn
                </a>
              ) : settings?.contact_email ? (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="inline-flex min-h-[44px] items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Me contacter
                </a>
              ) : null}

            </div>
          </div>
        </div>
      </section>

      {/* Projets phares */}
      {featured.length > 0 && (
        <section id="projets-phares" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-12">
          <h2 className="mb-6 font-serif text-xl font-bold text-foreground md:text-2xl">
            {settings?.featured_section_title}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((p: any) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      <CondensedList id="formations" title={settings?.formations_section_title ?? "Formations données"} items={formations} />
      <CondensedList id="missions" title={settings?.missions_section_title ?? "Autres missions courtes"} items={missions} />
      <CondensedList id="benevolat" title={settings?.benevolat_section_title ?? "Bénévolat"} items={benevolat} />

      {tools.length > 0 && (
        <section id="outils" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-10 md:py-14">
          <h2 className="mb-6 font-serif text-xl font-bold text-foreground md:text-2xl">
            {settings?.tools_section_title ?? "Outils et compétences"}
          </h2>
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <ul className="flex flex-wrap gap-2.5">
              {toolsFlat.map((name, i) => (
                <li
                  key={name}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-sm font-medium text-foreground",
                    i % 2 === 0 ? "bg-accent" : "bg-decorative",
                  )}
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 flex justify-center">
            <a
              href="/profil#outils"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-6 py-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary hover:bg-muted"
            >
              Voir tous mes outils sur mon profil
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      )}

      {hasContact && (
        <section id="contact" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16 text-center">
          <h2 className="mb-4 font-serif text-xl font-bold text-foreground md:text-2xl">Contact</h2>
          <p className="mx-auto mb-6 max-w-xl text-base text-muted-foreground">
            {settings?.contact_text
              ? renderInlineMarkdown(settings.contact_text)
              : "Une idée de projet, une mission à me confier\u00A0? Discutons-en."}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 min-h-[44px] flex items-center"
              >
                Voir mon CV
              </a>
            )}
          </div>
        </section>
      )}

      <SiteFooter
        footerText={settings?.footer_text ?? "© Martine Desmaroux"}
        email={contactEmail ?? ""}
        linkedinUrl={linkedinUrl}
      />
      <BackToTop afterId="hero" />
    </div>
  );
}