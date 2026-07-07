import { createFileRoute, useNavigate, useParams, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getProjectByIdAdmin, saveProject } from "@/lib/projects.functions";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ImageUpload";
import { resolveAccentColor } from "@/lib/utils/status";

const STATUS_SUGGESTIONS = [
  "Terminé",
  "Déployé",
  "MVP",
  "En production",
  "En cours",
  "POC",
  "Faite",
  "Produit",
];

export const Route = createFileRoute("/_authenticated/admin/projets/$id")({
  component: EditProject,
});

type BlockType = "text" | "video" | "image" | "quote" | "heading" | "liste" | "comparatif";
type Block = {
  id?: string;
  block_type: BlockType;
  title: string | null;
  content: string | null;
  media_url: string | null;
  alt_text: string | null;
  caption: string | null;
  display_order: number;
};

type Category = { label: string; items: string[] };

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
    mission_type: "",
    status_label: "",
    accent_color: "",
    cover_image_url: "",
    cover_image_alt_text: "",
    cover_image_position: "center",
    tags: [] as string[],
    summary: "",
    repo_url: "",
    repo_note: "",
    photo_profil_url: "",
    photo_profil_alt_text: "",
    role: "",
    impact: "",
    angle: "",
    published: false,
    display_order: 0,
  });
  const [tagsStr, setTagsStr] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (isNew) return;
    fetchProj({ data: { id } }).then((res) => {
      if (res) {
        setForm({
          ...res.project,
          tagline: res.project.tagline ?? "",
          mission_type: res.project.mission_type ?? "",
          status_label: res.project.status_label ?? "",
          accent_color: res.project.accent_color ?? "",
          cover_image_url: res.project.cover_image_url ?? "",
          cover_image_alt_text: res.project.cover_image_alt_text ?? "",
          summary: res.project.summary ?? "",
          repo_url: res.project.repo_url ?? "",
          repo_note: res.project.repo_note ?? "",
          photo_profil_url: res.project.photo_profil_url ?? "",
          photo_profil_alt_text: res.project.photo_profil_alt_text ?? "",
          role: res.project.role ?? "",
          impact: res.project.impact ?? "",
          angle: (res.project as { angle?: string | null }).angle ?? "",
        });
        setTagsStr(res.project.tags.join(", "));
        const cats = (res.project.tags_categorises as Category[] | null) ?? [];
        setCategories(Array.isArray(cats) ? cats : []);
        setBlocks(
          res.blocks.map((b) => ({
            id: b.id,
            block_type: b.block_type as BlockType,
            title: (b as { title?: string | null }).title ?? null,
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
          project: {
            ...form,
            tags,
            mission_type:
              form.project_type === "formation_mission" && form.mission_type
                ? form.mission_type
                : null,
            tags_categorises: form.project_type === "profil" ? categories : null,
          },
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

  function addBlock(type: BlockType) {
    const defaults: Partial<Block> = {};
    if (type === "comparatif") defaults.content = "Colonne A: point 1, point 2 || Colonne B: point 3, point 4";
    if (type === "liste") defaults.content = "Premier item\nDeuxième item";
    setBlocks([
      ...blocks,
      { block_type: type, title: null, content: defaults.content ?? "", media_url: "", alt_text: "", caption: "", display_order: blocks.length },
    ]);
  }

  const previewAccent = resolveAccentColor(form.accent_color, form.status_label);
  const isAutoAccent = !form.accent_color;
  const isLight = form.project_type === "formation_mission";

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
            <option value="poc_perso">Projet personnel (POC)</option>
            <option value="production_client">Projet client</option>
            <option value="poc_ecole">Projet réalisé en formation (POC école)</option>
            <option value="formation_mission">Formation, mission ou bénévolat</option>
            <option value="profil">Profil</option>
          </select>
        </Field>
        {form.project_type === "formation_mission" && (
          <Field label="Sous-type">
            <select value={form.mission_type} onChange={(e) => setForm({ ...form, mission_type: e.target.value })} className={inputCls}>
              <option value="">— Sélectionner —</option>
              <option value="formation">Formation donnée</option>
              <option value="mission">Mission courte</option>
              <option value="benevolat">Bénévolat</option>
            </select>
          </Field>
        )}
        <Field label="Rôle">
          <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputCls} placeholder="ex. Formatrice, Bénévole, Product Owner" />
        </Field>
        <Field label="Angle">
          <input value={form.angle ?? ""} onChange={(e) => setForm({ ...form, angle: e.target.value })} className={inputCls} placeholder="ex. Audit / poc, Cadrage / gouvernance" />
        </Field>
        <Field label="Statut">
          <input
            list="status-suggestions"
            value={form.status_label}
            onChange={(e) => setForm({ ...form, status_label: e.target.value })}
            className={inputCls}
            placeholder="Libre — ex. POC validé, MVP en déploiement, Faite"
          />
          <datalist id="status-suggestions">
            {STATUS_SUGGESTIONS.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </Field>
        {!isLight && (
          <Field label="Couleur d'accent">
            <div className="flex items-center gap-2">
              <input type="color" value={previewAccent} onChange={(e) => setForm({ ...form, accent_color: e.target.value })} className="h-10 w-16" />
              <input value={form.accent_color} onChange={(e) => setForm({ ...form, accent_color: e.target.value })} className={inputCls} placeholder="(auto d'après le statut)" />
              <button
                type="button"
                onClick={() => setForm({ ...form, accent_color: "" })}
                className="whitespace-nowrap rounded-md border border-border px-3 py-2 text-xs hover:bg-muted"
              >
                Réinitialiser
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span
                className="inline-flex items-center rounded-full px-3 py-1 font-medium"
                style={{ backgroundColor: `${previewAccent}22`, color: previewAccent }}
              >
                {form.status_label || "Aperçu"}
              </span>
              <span>{isAutoAccent ? "Couleur dérivée automatiquement du statut" : "Couleur personnalisée"}</span>
            </div>
          </Field>
        )}
        {!isLight && (
          <>
            <Field label="Image de couverture">
              <ImageUpload
                value={form.cover_image_url}
                onChange={(url) => setForm({ ...form, cover_image_url: url })}
                pathPrefix="covers"
              />
            </Field>
            <Field label="Texte alternatif de l'image">
              <input value={form.cover_image_alt_text} onChange={(e) => setForm({ ...form, cover_image_alt_text: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Position de l'image (ex. center, top left)">
              <input value={form.cover_image_position} onChange={(e) => setForm({ ...form, cover_image_position: e.target.value })} className={inputCls} />
            </Field>
          </>
        )}
        <Field label={isLight ? "Stack (tags séparés par des virgules)" : "Tags (séparés par des virgules)"}>
          <input value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} className={inputCls} placeholder="IA, n8n, Automatisation" />
        </Field>
        <Field label="Impact">
          <textarea rows={2} value={form.impact} onChange={(e) => setForm({ ...form, impact: e.target.value })} className={inputCls} placeholder="ex. 30 apprenants formés, +40% de conversion" />
        </Field>
        {!isLight && (
          <>
            <Field label="Résumé">
              <textarea rows={3} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Lien vers le dépôt (GitHub, Gamma, etc.)">
              <input value={form.repo_url} onChange={(e) => setForm({ ...form, repo_url: e.target.value })} className={inputCls} placeholder="https://…" />
            </Field>
            <Field label="Note si pas de lien">
              <input value={form.repo_note} onChange={(e) => setForm({ ...form, repo_note: e.target.value })} className={inputCls} placeholder="Anonymisé, dossier disponible sur demande" />
            </Field>
          </>
        )}
        <Field label="Ordre d'affichage">
          <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} className={inputCls} />
        </Field>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          <span className="text-sm text-foreground">Publié</span>
        </label>

        {form.project_type === "profil" && (
          <>
            <div className="mt-8 rounded-md border border-border bg-card p-4">
              <h2 className="mb-3 font-serif text-xl font-bold text-foreground">Photo de profil</h2>
              <div className="flex items-start gap-4">
                {form.photo_profil_url && (
                  <img
                    src={form.photo_profil_url}
                    alt="Aperçu photo de profil"
                    className="h-24 w-24 flex-shrink-0 rounded-full border border-border object-cover"
                  />
                )}
                <div className="flex-1">
                  <ImageUpload
                    value={form.photo_profil_url}
                    onChange={(url) => setForm({ ...form, photo_profil_url: url })}
                    pathPrefix="profil"
                    label="Choisir la photo de profil"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="mb-1 block text-sm font-medium text-foreground">Texte alternatif</label>
                <input
                  value={form.photo_profil_alt_text}
                  onChange={(e) => setForm({ ...form, photo_profil_alt_text: e.target.value })}
                  className={inputCls}
                  placeholder='ex. "Photo de profil de Martine Desmaroux"'
                />
              </div>
            </div>

            <div className="mt-4 rounded-md border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold text-foreground">Tags catégorisés</h2>
                <button
                  type="button"
                  onClick={() => setCategories([...categories, { label: "Nouvelle catégorie", items: [] }])}
                  className="rounded-md border border-border bg-background px-3 py-1.5 text-xs hover:bg-muted"
                >
                  + Catégorie
                </button>
              </div>
              <div className="space-y-3">
                {categories.map((cat, ci) => (
                  <div key={ci} className="rounded border border-border bg-background p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <input
                        value={cat.label}
                        onChange={(e) => {
                          const c = [...categories];
                          c[ci] = { ...c[ci], label: e.target.value };
                          setCategories(c);
                        }}
                        placeholder="Nom de la catégorie"
                        className={inputCls}
                      />
                      <button
                        type="button"
                        onClick={() => setCategories(categories.filter((_, i) => i !== ci))}
                        className="rounded border border-border px-2 py-1 text-xs text-destructive"
                      >
                        ×
                      </button>
                    </div>
                    <input
                      value={cat.items.join(", ")}
                      onChange={(e) => {
                        const items = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                        const c = [...categories];
                        c[ci] = { ...c[ci], items };
                        setCategories(c);
                      }}
                      placeholder="Tag 1, Tag 2, Tag 3"
                      className={inputCls}
                    />
                  </div>
                ))}
                {categories.length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucune catégorie. Ajoutez-en une.</p>
                )}
              </div>
            </div>
          </>
        )}

        {!isLight && (
        <div className="mt-8">
          <h2 className="mb-3 font-serif text-xl font-bold text-foreground">Blocs de contenu</h2>
          <div className="mb-3 flex flex-wrap gap-2">
            {(["heading", "text", "quote", "liste", "comparatif", "image", "video"] as const).map((t) => (
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
                {b.block_type !== "heading" && (
                  <input
                    placeholder="Titre du bloc (optionnel)"
                    value={b.title ?? ""}
                    onChange={(e) => { const c = [...blocks]; c[i].title = e.target.value; setBlocks(c); }}
                    className={`${inputCls} mb-2`}
                  />
                )}
                {(b.block_type === "text" || b.block_type === "quote" || b.block_type === "heading") && (
                  <>
                    {b.block_type === "text" && (
                      <p className="mb-1 text-xs text-muted-foreground">
                        Liens : <code>[texte](https://url)</code>
                      </p>
                    )}
                    <textarea rows={b.block_type === "heading" ? 1 : 3} value={b.content ?? ""} onChange={(e) => { const c = [...blocks]; c[i].content = e.target.value; setBlocks(c); }} className={inputCls} />
                  </>
                )}
                {b.block_type === "liste" && (
                  <>
                    <p className="mb-1 text-xs text-muted-foreground">Un item par ligne.</p>
                    <textarea rows={4} value={b.content ?? ""} onChange={(e) => { const c = [...blocks]; c[i].content = e.target.value; setBlocks(c); }} className={inputCls} />
                  </>
                )}
                {b.block_type === "comparatif" && (
                  <>
                    <p className="mb-1 text-xs text-muted-foreground">
                      Format : <code>Colonne A: point 1, point 2 || Colonne B: point 3, point 4</code>
                    </p>
                    <textarea rows={3} value={b.content ?? ""} onChange={(e) => { const c = [...blocks]; c[i].content = e.target.value; setBlocks(c); }} className={inputCls} />
                  </>
                )}
                {b.block_type === "image" && (
                  <>
                    <ImageUpload
                      value={b.media_url}
                      onChange={(url) => { const c = [...blocks]; c[i].media_url = url; setBlocks(c); }}
                      pathPrefix="blocks"
                    />
                    <input placeholder="Texte alternatif" value={b.alt_text ?? ""} onChange={(e) => { const c = [...blocks]; c[i].alt_text = e.target.value; setBlocks(c); }} className={`${inputCls} mb-2 mt-2`} />
                    <input placeholder="Légende" value={b.caption ?? ""} onChange={(e) => { const c = [...blocks]; c[i].caption = e.target.value; setBlocks(c); }} className={inputCls} />
                  </>
                )}
                {b.block_type === "video" && (
                  <>
                    <input placeholder="URL vidéo (YouTube, Loom, Arcade)" value={b.media_url ?? ""} onChange={(e) => { const c = [...blocks]; c[i].media_url = e.target.value; setBlocks(c); }} className={`${inputCls} mb-2`} />
                    <input placeholder="Texte alternatif" value={b.alt_text ?? ""} onChange={(e) => { const c = [...blocks]; c[i].alt_text = e.target.value; setBlocks(c); }} className={`${inputCls} mb-2`} />
                    <input placeholder="Légende" value={b.caption ?? ""} onChange={(e) => { const c = [...blocks]; c[i].caption = e.target.value; setBlocks(c); }} className={inputCls} />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        )}


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
