import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getSiteSettings, saveSiteSettings } from "@/lib/settings.functions";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ImageUpload";


export const Route = createFileRoute("/_authenticated/admin/reglages")({
  component: SettingsPage,
});

function SettingsPage() {
  const fetch = useServerFn(getSiteSettings);
  const save = useServerFn(saveSiteSettings);
  const [s, setS] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [toolsStr, setToolsStr] = useState("");

  useEffect(() => {
    fetch().then((data) => {
      setS({
        ...data,
        cover_image_url: data?.cover_image_url ?? "",
        cover_image_alt_text: data?.cover_image_alt_text ?? "",
        profile_photo_url: data?.profile_photo_url ?? "",
        profile_photo_alt_text: data?.profile_photo_alt_text ?? "",
        linkedin_url: data?.linkedin_url ?? "",
        bahut_url: data?.bahut_url ?? "",
      });
      setToolsStr(JSON.stringify(data?.tools_json ?? [], null, 2));
    });
  }, [fetch]);

  if (!s) return <div className="p-8">Chargement…</div>;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const tools = JSON.parse(toolsStr);
      await save({ data: { ...s, tools_json: tools } });
      toast.success("Réglages enregistrés");
    } catch (err: any) {
      toast.error(err.message || "Erreur");
    } finally {
      setBusy(false);
    }
  }

  const upd = (k: string) => (e: any) => setS({ ...s, [k]: e.target.value });

  return (
    <div className="mx-auto max-w-3xl p-8">
      <Link to="/admin" className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground">← Retour</Link>
      <h1 className="mb-6 font-serif text-3xl font-bold text-foreground">Réglages du site</h1>
      <form onSubmit={submit} className="space-y-4">
        <F label="Titre du hero"><input value={s.hero_title} onChange={upd("hero_title")} className={cls} /></F>
        <F label="Sous-titre"><input value={s.hero_subtitle} onChange={upd("hero_subtitle")} className={cls} /></F>
        <F label="Introduction"><textarea rows={4} value={s.hero_intro} onChange={upd("hero_intro")} className={cls} /></F>

        <F label="URL image de couverture"><input value={s.cover_image_url} onChange={upd("cover_image_url")} className={cls} /></F>
        <F label="Texte alternatif de l'image de couverture">
          <input value={s.cover_image_alt_text} onChange={upd("cover_image_alt_text")} className={cls} placeholder="Laissé vide : le titre du hero sera utilisé" />
        </F>

        <F label="URL photo de profil"><input value={s.profile_photo_url} onChange={upd("profile_photo_url")} className={cls} /></F>
        <F label="Texte alternatif de la photo de profil">
          <input value={s.profile_photo_alt_text} onChange={upd("profile_photo_alt_text")} className={cls} placeholder='Laissé vide : "Photo de profil de Martine Desmaroux"' />
        </F>

        <F label="Email de contact"><input type="email" value={s.contact_email} onChange={upd("contact_email")} className={cls} /></F>
        <F label="LinkedIn"><input value={s.linkedin_url} onChange={upd("linkedin_url")} className={cls} /></F>
        <F label="URL Le Bahut"><input value={s.bahut_url} onChange={upd("bahut_url")} className={cls} /></F>

        <F label="Titre section projets phares"><input value={s.featured_section_title} onChange={upd("featured_section_title")} className={cls} /></F>
        <F label="Titre section formations"><input value={s.formations_section_title} onChange={upd("formations_section_title")} className={cls} /></F>
        <F label="Titre section missions courtes"><input value={s.missions_section_title} onChange={upd("missions_section_title")} className={cls} /></F>
        <F label="Titre section outils"><input value={s.tools_section_title} onChange={upd("tools_section_title")} className={cls} /></F>

        <F label='Outils (JSON : [{"category":"...","items":["..."]}])'>
          <textarea rows={10} value={toolsStr} onChange={(e) => setToolsStr(e.target.value)} className={`${cls} font-mono text-xs`} />
        </F>

        <F label="Pied de page"><input value={s.footer_text} onChange={upd("footer_text")} className={cls} /></F>

        <button type="submit" disabled={busy} className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50">
          {busy ? "…" : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}

const cls = "w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent";
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div><label className="mb-1 block text-sm font-medium text-foreground">{label}</label>{children}</div>);
}
