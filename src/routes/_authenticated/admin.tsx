import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listAllProjects,
  deleteProject,
  togglePublished,
  checkIsAdmin,
} from "@/lib/projects.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Administration" }] }),
  component: AdminPage,
});

function AdminPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fetchList = useServerFn(listAllProjects);
  const fetchAdmin = useServerFn(checkIsAdmin);
  const del = useServerFn(deleteProject);
  const toggle = useServerFn(togglePublished);

  const adminQ = useQuery({ queryKey: ["is_admin"], queryFn: () => fetchAdmin() });
  const listQ = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: () => fetchList(),
    enabled: !!adminQ.data?.isAdmin,
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    router.navigate({ to: "/", replace: true });
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
            {listQ.data?.map((p) => (
              <tr key={p.id} className="border-b border-border">
                <td className="p-3 font-medium text-foreground">{p.title}</td>
                <td className="p-3 text-muted-foreground">{p.project_type}</td>
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
                  <Link
                    to="/admin/projets/$id"
                    params={{ id: p.id }}
                    className="mr-3 text-accent hover:underline"
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
                </td>
              </tr>
            ))}
            {listQ.data?.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-muted-foreground">
                  Aucun projet. Créez-en un pour commencer.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
