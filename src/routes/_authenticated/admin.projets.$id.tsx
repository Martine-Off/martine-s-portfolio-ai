import { createFileRoute, useNavigate, useParams, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getProjectByIdAdmin, saveProject } from "@/lib/projects.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/projets/$id")({
  component: EditProject,
});

type Block = {
  id?: string;
  block_type: "text" | "video" | "image" | "quote" | "heading";
  content: string | null;
  media_url: string | null;
  alt_text: string | null;
  caption: string | null;
  display_order: number;
};

function EditProject() {
  const { id } = useParams({ from: "/_authenticated/admin/projets/$id" });
  const navigate = useNavigate();
  const isNew = id === "nouveau";
  const fetchProj = useServerFn(getProjectByIdAdmin);
  const save = useServerFn(saveProject);

  const [loading, setLoading] = useState(!isNew);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<any>({
    id: null,
    title: "",
    slug: "",
    tagline: "",
    project_type: "poc_perso",
    status_label: "",
    accent_color: "#65BFF1",
    cover_image_url: "",
    cover_image_alt_text: "",
    cover_image_position: "center",
    tags: [] as string[],
    summary: "",
    external_url: "",
    published: false,
    display_order: 0,
  });
  const [tagsStr, setTagsStr] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    if (isNew) return;
    fetchProj({ data: { id } }).then((res) => {
      if (res) {
        setForm({
          ...res.project,
          tagline: res.project.tagline ?? "",
          status_label: res.project.status_label ?? "",
          cover_image_url: res.project.cover_image_url ?? "",
          cover_image_alt_text: res.project.cover_image_alt_text ?? "",
          summary: res.project.summary ?? "",
          external_url: res.project.external_url ?? "",
        });
        setTagsStr(res.project.tags.join(", "));
        setBlocks(
          res.blocks.map((b) => ({
            id: b.id,
            block_type: b.block_type as Block["block_type"],
            content: b.content,
            media_url: b.media_url,
            alt_text: b.alt_text,
            caption: b.caption,
            display_order: b.display_order,
          })),
        );
      }
      setLoading(false);
    });
  }, [id, isNew, fetchProj]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const tags = tagsStr.split(",").map((t) => t.trim()).filter(Boolean);
      const res = await save({
        data: {
          project: { ...form, tags },
          blocks: blocks.map((b, i) => ({ ...b, display_order: i })),
        },
      });
      toast.success("Enregistré");
      if (isNew) navigate({ to: "/admin/projets/$id", params: { id: res.id } });
    } catch (err: any) {
      toast.error(err.message || "Erreur");
    } finally {
      setBusy(false);
    }
  }

  function addBlock(type: Block["block_type"]) {
    setBlocks([
      ...blocks,
      { block_type: type, content: "", media_url: "", alt_text: "", caption: "", display_order: blocks.length },
    ]);
  }

  if (loading) return <div className="p-8">Chargement…</div>;

  return (
    <div className="mx-auto max-w-4xl p-8">
      <Link to="/admin" className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground">
        ← Retour
      </Link>
      <h1 className="mb-6 font-serif text-3xl font-bold text-foreground">
        {isNew ? "Nouveau projet" : "Modifier le projet"}
      </h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Titre">
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Slug (optionnel, généré depuis le titre)">
          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputCls} placeholder="mon-projet" />
        </Field>
        <Field label="Sous-titre">
          <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Type">
          <select value={form.project_type} onChange={(e) => setForm({ ...form, project_type: e.target.value })} className={inputCls}>
            <option value="poc_perso">POC personnel</option>
            <option value="production_client">Production client</option>
            <option value="formation_donnees">Formation donnée</option>
            <option value="mission_courte">Mission courte</option>
            <option value="profil">Profil</option>
          </select>
        </Field>
        <Field label="Statut (badge)">
          <input value={form.status_label} onChange={(e) => setForm({ ...form, status_label: e.target.value })} className={inputCls} placeholder="Livré, En cours…" />
        </Field>
        <Field label="Couleur d'accent (hex)">
          <div className="flex gap-2">
            <input type="color" value={form.accent_color} onChange={(e) => setForm({ ...form, accent_color: e.target.value })} className="h-10 w-16" />
            <input value={form.accent_color} onChange={(e) => setForm({ ...form, accent_color: e.target.value })} className={inputCls} />
          </div>
        </Field>
        <Field label="URL image de couverture">
          <input value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Texte alternatif de l'image">
          <input value={form.cover_image_alt_text} onChange={(e) => setForm({ ...form, cover_image_alt_text: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Position de l'image (ex. center, top left)">
          <input value={form.cover_image_position} onChange={(e) => setForm({ ...form, cover_image_position: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Tags (séparés par des virgules)">
          <input value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} className={inputCls} placeholder="IA, n8n, Automatisation" />
        </Field>
        <Field label="Résumé">
          <textarea rows={3} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className={inputCls} />
        </Field>
        <Field label="URL externe">
          <input value={form.external_url} onChange={(e) => setForm({ ...form, external_url: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Ordre d'affichage">
          <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} className={inputCls} />
        </Field>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          <span className="text-sm text-foreground">Publié</span>
        </label>

        <div className="mt-8">
          <h2 className="mb-3 font-serif text-xl font-bold text-foreground">Blocs de contenu</h2>
          <div className="mb-3 flex gap-2">
            {(["heading", "text", "quote", "image", "video"] as const).map((t) => (
              <button key={t} type="button" onClick={() => addBlock(t)} className="rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-muted">
                + {t}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {blocks.map((b, i) => (
              <div key={i} className="rounded-md border border-border bg-card p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase text-muted-foreground">{b.block_type}</span>
                  <div className="flex gap-2 text-xs">
                    {i > 0 && (
                      <button type="button" onClick={() => { const c = [...blocks]; [c[i - 1], c[i]] = [c[i], c[i - 1]]; setBlocks(c); }} className="text-accent">↑</button>
                    )}
                    {i < blocks.length - 1 && (
                      <button type="button" onClick={() => { const c = [...blocks]; [c[i + 1], c[i]] = [c[i], c[i + 1]]; setBlocks(c); }} className="text-accent">↓</button>
                    )}
                    <button type="button" onClick={() => setBlocks(blocks.filter((_, j) => j !== i))} className="text-destructive">×</button>
                  </div>
                </div>
                {(b.block_type === "text" || b.block_type === "quote" || b.block_type === "heading") && (
                  <textarea rows={b.block_type === "heading" ? 1 : 3} value={b.content ?? ""} onChange={(e) => { const c = [...blocks]; c[i].content = e.target.value; setBlocks(c); }} className={inputCls} />
                )}
                {(b.block_type === "image" || b.block_type === "video") && (
                  <>
                    <input placeholder="URL" value={b.media_url ?? ""} onChange={(e) => { const c = [...blocks]; c[i].media_url = e.target.value; setBlocks(c); }} className={`${inputCls} mb-2`} />
                    <input placeholder="Texte alternatif" value={b.alt_text ?? ""} onChange={(e) => { const c = [...blocks]; c[i].alt_text = e.target.value; setBlocks(c); }} className={`${inputCls} mb-2`} />
                    <input placeholder="Légende" value={b.caption ?? ""} onChange={(e) => { const c = [...blocks]; c[i].caption = e.target.value; setBlocks(c); }} className={inputCls} />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={busy} className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50">
          {busy ? "…" : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}

const inputCls = "w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}
