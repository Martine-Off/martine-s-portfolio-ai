import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  listAllProjects,
  deleteProject,
  togglePublished,
  reorderProject,
  checkIsAdmin,
} from "@/lib/projects.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "Administration" }] }),
  component: AdminPage,
});

type FilterTab = "all" | "projects" | "formations" | "missions" | "benevolat" | "profil";

type ProjectRow = {
  id: string;
  title: string;
  project_type: string;
  mission_type: string | null;
  published: boolean;
  display_order: number;
};

const TABS: { id: FilterTab; label: string; match: (p: ProjectRow) => boolean }[] = [
  { id: "all", label: "Tous", match: () => true },
  {
    id: "projects",
    label: "Projets",
    match: (p) => ["poc_perso", "production_client", "poc_ecole"].includes(p.project_type),
  },
  {
    id: "formations",
    label: "Formations",
    match: (p) => p.project_type === "formation_mission" && p.mission_type === "formation",
  },
  {
    id: "missions",
    label: "Missions",
    match: (p) => p.project_type === "formation_mission" && p.mission_type === "mission",
  },
  {
    id: "benevolat",
    label: "Bénévolat",
    match: (p) => p.project_type === "formation_mission" && p.mission_type === "benevolat",
  },
  { id: "profil", label: "Profil", match: (p) => p.project_type === "profil" },
];

function AdminPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fetchList = useServerFn(listAllProjects);
  const fetchAdmin = useServerFn(checkIsAdmin);
  const del = useServerFn(deleteProject);
  const toggle = useServerFn(togglePublished);
  const reorder = useServerFn(reorderProject);

  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const adminQ = useQuery({ queryKey: ["is_admin"], queryFn: () => fetchAdmin() });
  const listQ = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: () => fetchList(),
    enabled: !!adminQ.data?.isAdmin,
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await router.navigate({ to: "/", replace: true });
    await supabase.auth.signOut();
  }

  async function handleMove(project: ProjectRow, direction: "up" | "down") {
    const all = listQ.data ?? [];
    const visible = all.filter(TABS.find((t) => t.id === activeTab)!.match);
    const index = visible.findIndex((p) => p.id === project.id);
    if (index === -1) return;
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= visible.length) return;
    const other = visible[swapIndex];
    const newOrder = direction === "up" ? other.display_order - 1 : other.display_order + 1;
    await reorder({ data: { id: project.id, display_order: newOrder } });
    toast.success("Ordre mis à jour");
    listQ.refetch();
  }

  if (adminQ.isLoading) return <div className="p-8">Chargement…</div>;
  if (!adminQ.data?.isAdmin)
    return (
      <div className="mx-auto max-w-2xl p-8">
        <h1 className="font-serif text-2xl text-foreground">Accès refusé</h1>
        <p className="mt-2 text-muted-foreground">
          Votre compte n'a pas le rôle administrateur. Contactez le support pour l'obtenir.
        </p>
        <button onClick={signOut} className="mt-4 rounded-md border border-border px-4 py-2 text-sm">
          Se déconnecter
        </button>
      </div>
    );

  const allProjects = (listQ.data ?? []) as ProjectRow[];
  const activeMatcher = TABS.find((t) => t.id === activeTab)!.match;
  const visibleProjects = allProjects.filter(activeMatcher);
  const counts = Object.fromEntries(
    TABS.map((tab) => [tab.id, allProjects.filter(tab.match).length]),
  ) as Record<FilterTab, number>;

  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-foreground">Administration</h1>
        <div className="flex gap-2">
          <Link
            to="/admin/reglages"
            className="rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-muted"
          >
            Réglages du site
          </Link>
          <Link
            to="/admin/import"
            className="rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-muted"
          >
            Importer en masse
          </Link>
          <Link
            to="/admin/projets/nouveau"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            + Nouveau projet
          </Link>
          <button onClick={signOut} className="rounded-md border border-border px-4 py-2 text-sm">
            Déconnexion
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                "rounded-md border px-4 py-2 text-sm transition-colors",
                isActive
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-card text-foreground hover:bg-muted",
              ].join(" ")}
            >
              {tab.label} ({counts[tab.id]})
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted text-left">
            <tr>
              <th className="p-3">Titre</th>
              <th className="p-3">Type</th>
              <th className="p-3">Publié</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleProjects.map((p, index) => (
              <tr key={p.id} className="border-b border-border">
                <td className="p-3 font-medium text-foreground">{p.title}</td>
                <td className="p-3 text-muted-foreground">
                  {p.project_type}
                  {p.mission_type ? ` / ${p.mission_type}` : ""}
                </td>
                <td className="p-3">
                  <button
                    onClick={async () => {
                      await toggle({ data: { id: p.id, published: !p.published } });
                      toast.success(p.published ? "Dépublié" : "Publié");
                      listQ.refetch();
                    }}
                    className="text-accent hover:underline"
                  >
                    {p.published ? "Oui" : "Non"}
                  </button>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleMove(p, "up")}
                      disabled={index === 0}
                      className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted disabled:opacity-40"
                      aria-label="Monter"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleMove(p, "down")}
                      disabled={index === visibleProjects.length - 1}
                      className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted disabled:opacity-40"
                      aria-label="Descendre"
                    >
                      ↓
                    </button>
                    <Link
                      to="/admin/projets/$id"
                      params={{ id: p.id }}
                      className="text-accent hover:underline"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={async () => {
                        if (!confirm(`Supprimer "${p.title}" ?`)) return;
                        await del({ data: { id: p.id } });
                        toast.success("Supprimé");
                        listQ.refetch();
                      }}
                      className="text-destructive hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {visibleProjects.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-muted-foreground">
                  Aucun projet dans cette catégorie.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
