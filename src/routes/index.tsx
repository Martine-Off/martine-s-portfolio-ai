import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getSiteSettings } from "@/lib/settings.functions";
import { listPublishedProjects } from "@/lib/projects.functions";
import { ProjectCard } from "@/components/ProjectCard";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const settingsQuery = queryOptions({ queryKey: ["site_settings"], queryFn: () => getSiteSettings() });
const projectsQuery = queryOptions({ queryKey: ["projects", "public"], queryFn: () => listPublishedProjects() });

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(settingsQuery),
      context.queryClient.ensureQueryData(projectsQuery),
    ]);
  },
  component: HomePage,
  errorComponent: ({ error }) => (
    <div className="p-8 text-foreground">Erreur : {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-8">404</div>,
});

function HomePage() {
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const { data: projects } = useSuspenseQuery(projectsQuery);

  const featured = projects.filter(
    (p) => p.project_type === "poc_perso" || p.project_type === "production_client",
  );
  const formations = projects.filter((p) => p.project_type === "formation_donnees");
  const missions = projects.filter((p) => p.project_type === "mission_courte");
  const tools = (settings?.tools_json ?? []) as Array<{ category: string; items: string[] }>;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader heroTitle={settings?.hero_title ?? "Martine Desmaroux"} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        {settings?.cover_image_url && (
          <div className="absolute inset-0 -z-10">
            <img
              src={settings.cover_image_url}
              alt={settings.cover_image_alt_text || settings.hero_title || ""}
              className="h-full w-full object-cover opacity-20"
            />
          </div>
        )}
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {settings?.hero_subtitle}
          </p>
          <h1 className="font-serif text-4xl font-bold leading-tight text-foreground md:text-6xl">
            {settings?.hero_title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {settings?.hero_intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/profil"
              className="rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              À propos
            </Link>
            <a
              href={`mailto:${settings?.contact_email}`}
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Me contacter
            </a>
          </div>
        </div>
      </section>

      {/* Projets phares */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="mb-8 font-serif text-3xl font-bold text-foreground md:text-4xl">
            {settings?.featured_section_title}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      {/* Formations */}
      {formations.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="mb-8 font-serif text-3xl font-bold text-foreground md:text-4xl">
            {settings?.formations_section_title}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {formations.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      {/* Missions courtes */}
      {missions.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="mb-8 font-serif text-3xl font-bold text-foreground md:text-4xl">
            {settings?.missions_section_title}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {missions.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      {/* Outils & compétences */}
      {tools.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="mb-8 font-serif text-3xl font-bold text-foreground md:text-4xl">
            {settings?.tools_section_title}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {tools.map((cat) => (
              <div key={cat.category} className="rounded-lg border border-border bg-card p-5">
                <h3 className="mb-3 font-serif text-lg font-bold text-foreground">{cat.category}</h3>
                <ul className="flex flex-wrap gap-1.5">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="rounded border border-border bg-background px-2 py-0.5 text-xs text-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      <SiteFooter
        footerText={settings?.footer_text ?? "© Martine Desmaroux"}
        email={settings?.contact_email ?? ""}
        linkedinUrl={settings?.linkedin_url}
      />
    </div>
  );
}
