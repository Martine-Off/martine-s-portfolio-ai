import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getProfilePage } from "@/lib/projects.functions";
import { getSiteSettings } from "@/lib/settings.functions";
import { BlockRenderer } from "@/components/BlockRenderer";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageState } from "@/components/PageState";
import { ProjectToc } from "@/components/ProjectToc";

const settingsQuery = queryOptions({ queryKey: ["site_settings"], queryFn: () => getSiteSettings() });
const profileQuery = queryOptions({ queryKey: ["profile"], queryFn: () => getProfilePage() });

const DEFAULT_DESCRIPTION = "Parcours et compétences de Martine Desmaroux, cheffe de projet IA.";

interface SchemaPerson {
  "@context": "https://schema.org";
  "@type": "Person";
  name: string;
  url: string;
  jobTitle: string;
  description: string;
  sameAs: string[];
}

export const Route = createFileRoute("/profil")({
  head: ({ loaderData }: any) => {
    const data = loaderData as
      | { photo: string | null; jobTitle: string | null; linkedinUrl: string | null; bio: string | null }
      | undefined;
    const photo = data?.photo;
    
    const personSchema: SchemaPerson = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Martine Desmaroux",
      url: "https://martine-ia.lovable.app",
      jobTitle: data?.jobTitle || "Product Manager & Consultante",
      description: data?.bio || "Portfolio professionnel de Martine Desmaroux, spécialisée en Product Management et conseil stratégique.",
      sameAs: data?.linkedinUrl 
        ? [data.linkedinUrl] 
        : ["https://www.linkedin.com/in/martine-desmaroux"]
    };
    return {
      meta: [
        { title: "Profil — Martine Desmaroux" },
        { name: "description", content: DEFAULT_DESCRIPTION },
        { property: "og:title", content: "Profil — Martine Desmaroux" },
        { property: "og:description", content: DEFAULT_DESCRIPTION },
        { property: "og:image", content: photo || "/og-default.jpg" },
      ],
      links: [{ rel: "canonical", href: "https://martine-ia.lovable.app/profil" }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(personSchema) }],
    };
  },
  loader: async ({ context }: any) => {
    await Promise.all([
      context.queryClient.ensureQueryData(settingsQuery),
      context.queryClient.ensureQueryData(profileQuery),
    ]);
    const settings = context.queryClient.getQueryData(["site_settings"]) as Awaited<ReturnType<typeof getSiteSettings>> | undefined;
    const profile = context.queryClient.getQueryData(["profile"]) as Awaited<ReturnType<typeof getProfilePage>> | undefined;
    return {
      photo: profile?.project?.photo_profil_url ?? null,
      jobTitle: settings?.hero_subtitle ?? null,
      linkedinUrl: settings?.linkedin_url?.trim() || null,
      bio: profile?.project?.summary || profile?.project?.tagline || null,
    };
  },
  component: ProfilPage,
  errorComponent: ({ error, reset }: any) => (
    <PageState
      variant="error"
      title="Impossible de charger le profil"
      message={error.message}
      primary={{ label: "Réessayer", onClick: reset }}
      secondary={{ label: "Accueil", to: "/" }}
    />
  ),
  notFoundComponent: () => (
    <PageState variant="notfound" title="Profil introuvable" primary={{ label: "Retour à l'accueil", to: "/" }} />
  ),
});


function ProfilPage() {
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const { data: profile } = useSuspenseQuery(profileQuery);

  const toolsRaw = (settings?.tools_json ?? []) as Array<{ category: string; items: { name: string; show_on_home: boolean }[] }>;
  const tools = toolsRaw.filter((cat) => cat.items.length > 0);

  const photoUrl = profile?.project.photo_profil_url;
  const photoAlt = profile?.project.photo_profil_alt_text;

  type BlockWithTitle = NonNullable<typeof profile>["blocks"][number] & { title: string | null };
  const blockTocItems = (profile?.blocks as BlockWithTitle[] || [])
    .map((b) => {
      const label = b.block_type === "heading" ? (b.content ?? "").trim() : (b.title ?? "").trim();
      return label ? { id: `block-${b.id}`, label } : null;
    })
    .filter((x): x is { id: string; label: string } => x !== null);

  const toolsTocItem = tools.length > 0 ? [{ id: "outils", label: "Outils et compétences" }] : [];
  const tocItems = [...blockTocItems, ...toolsTocItem];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader heroTitle={settings?.hero_title ?? ""} />

      <div className="mx-auto max-w-[76.5rem] px-6 py-16 md:py-24">
        <div className="lg:grid lg:grid-cols-[minmax(0,56rem)_240px] lg:items-start lg:gap-10">
          <div className="mx-auto w-full max-w-4xl lg:mx-0 lg:max-w-none">
            <div className="flex flex-col gap-8 md:flex-row md:items-start">
          {photoUrl && (
            <img
              src={photoUrl}
              alt={photoAlt || "Photo de profil de Martine Desmaroux"}
              className="h-40 w-40 flex-shrink-0 rounded-full border-4 border-accent object-cover md:h-56 md:w-56"
            />
          )}
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              {settings?.hero_title || profile?.project.title || "Profil"}
            </h1>
            {settings?.hero_subtitle && (
              <p className="mt-1 text-lg font-normal" style={{ color: "#5F5A85" }}>
                {settings.hero_subtitle}
              </p>
            )}
            {profile?.project.tagline && (
              <p className="mt-4 text-base text-muted-foreground">{profile.project.tagline}</p>
            )}
          </div>
        </div>

        {profile?.project.summary && (
          <p className="mt-8 text-base leading-relaxed text-foreground">{profile.project.summary}</p>
        )}

        {profile?.blocks && profile.blocks.length > 0 && (
          <div className="mt-10">
            {profile.blocks.map((b: any) => (
              <BlockRenderer key={b.id} block={b} />
            ))}
          </div>
        )}

        {tools.length > 0 && (
          <div id="outils" className="mt-12 scroll-mt-20">
            <h2 className="mb-6 font-serif text-xl font-bold text-foreground md:text-2xl">Outils et compétences</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {tools.map((group, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-5">
                  <h3 className="mb-3 font-serif text-base font-bold text-foreground">{group.category}</h3>
                  <ul className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item.name}
                        className="rounded border border-border bg-background px-2 py-0.5 text-xs text-foreground"
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

          </div>

          {tocItems.length > 0 && (
            <ProjectToc sections={tocItems} className="hidden lg:block" />
          )}
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
