import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getProfilePage } from "@/lib/projects.functions";
import { getSiteSettings } from "@/lib/settings.functions";
import { BlockRenderer } from "@/components/BlockRenderer";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageState } from "@/components/PageState";

const settingsQuery = queryOptions({ queryKey: ["site_settings"], queryFn: () => getSiteSettings() });
const profileQuery = queryOptions({ queryKey: ["profile"], queryFn: () => getProfilePage() });

export const Route = createFileRoute("/profil")({
  head: ({ loaderData }) => {
    const photo = (loaderData as { photo?: string | null } | undefined)?.photo;
    return {
      meta: [
        { title: "Profil — Martine Desmaroux" },
        { name: "description", content: "Parcours et compétences de Martine Desmaroux, cheffe de projet IA." },
        { property: "og:title", content: "Profil — Martine Desmaroux" },
        { property: "og:description", content: "Parcours et compétences de Martine Desmaroux, cheffe de projet IA." },
        { property: "og:image", content: photo || "/og-default.jpg" },
      ],
    };
  },
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(settingsQuery),
      context.queryClient.ensureQueryData(profileQuery),
    ]);
    const profile = context.queryClient.getQueryData<Awaited<ReturnType<typeof getProfilePage>>>(["profile"]);
    return { photo: profile?.project?.photo_profil_url ?? null };
  },
  component: ProfilPage,
  errorComponent: ({ error, reset }) => (
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

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader heroTitle={settings?.hero_title ?? ""} />

      <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          {photoUrl && (
            <img
              src={photoUrl}
              alt={photoAlt || "Photo de profil de Martine Desmaroux"}
              className="h-40 w-40 flex-shrink-0 rounded-full border border-border object-cover md:h-56 md:w-56"
            />
          )}
          <div>
            <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl">
              {profile?.project.title ?? "Profil"}
            </h1>
            {profile?.project.tagline && (
              <p className="mt-4 text-lg text-muted-foreground">{profile.project.tagline}</p>
            )}
          </div>
        </div>

        {profile?.project.summary && (
          <p className="mt-8 text-base leading-relaxed text-foreground">{profile.project.summary}</p>
        )}

        {profile?.blocks && profile.blocks.length > 0 && (
          <div className="mt-10">
            {profile.blocks.map((b) => (
              <BlockRenderer key={b.id} block={b} />
            ))}
          </div>
        )}

        {tools.length > 0 && (
          <div id="outils" className="mt-12 scroll-mt-20">
            <h2 className="mb-6 font-serif text-2xl font-bold text-foreground md:text-3xl">Outils et compétences</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {tools.map((group, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-5">
                  <h3 className="mb-3 font-serif text-lg font-bold text-foreground">{group.category}</h3>
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

      <SiteFooter
        footerText={settings?.footer_text ?? ""}
        email={settings?.contact_email ?? ""}
        linkedinUrl={settings?.linkedin_url}
      />
    </div>
  );
}
