import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { saveProject } from "@/lib/projects.functions";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/projets/nouveau")({
  component: NewProject,
});

function NewProject() {
  const save = useServerFn(saveProject);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("poc_perso");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await save({
        data: {
          project: {
            title,
            project_type: type as any,
            accent_color: null,
            cover_image_position: "center",
            tags: [],
            published: false,
            display_order: 0,
          },
          blocks: [],
        },
      });
      toast.success("Projet créé");
      navigate({ to: "/admin/projets/$id", params: { id: res.id } });
    } catch (err: any) {
      toast.error(err.message || "Erreur");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg p-8">
      <h1 className="mb-6 font-serif text-3xl font-bold text-foreground">Nouveau projet</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Titre</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2">
            <option value="poc_perso">Projet personnel (POC)</option>
            <option value="production_client">Projet client</option>
            <option value="poc_ecole">Projet réalisé en formation (POC école)</option>
            <option value="formation_mission">Formation, mission ou bénévolat</option>
            <option value="profil">Profil</option>
          </select>
        </div>
        <button type="submit" disabled={busy} className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50">
          {busy ? "…" : "Créer et modifier"}
        </button>
      </form>
    </div>
  );
}
