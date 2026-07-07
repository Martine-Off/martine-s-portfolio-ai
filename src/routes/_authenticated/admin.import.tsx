import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import Papa from "papaparse";
import { bulkImportProjects } from "@/lib/projects.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/import")({
  head: () => ({
    meta: [
      { title: "Import en masse — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ImportPage,
});

type BlockType = "text" | "video" | "image" | "quote" | "heading" | "liste" | "comparatif";

type ProjectType = "poc_perso" | "production_client" | "poc_ecole" | "formation_mission" | "profil";

const PROJECT_TYPES: ProjectType[] = [
  "poc_perso",
  "production_client",
  "poc_ecole",
  "formation_mission",
  "profil",
];

const MISSION_TYPES = ["formation", "mission", "benevolat"] as const;

const BLOCK_TYPE_MAP: Record<string, BlockType> = {
  texte: "text",
  citation: "quote",
  liste: "liste",
  comparatif: "comparatif",
  image: "image",
  video: "video",
  heading: "heading",
};

type ParsedRow = {
  rowIndex: number;
  raw: Record<string, string>;
  project: {
    title: string;
    slug?: string;
    emoji?: string | null;
    tagline?: string | null;
    role?: string | null;
    angle?: string | null;
    status_label?: string | null;
    tags: string[];
    impact?: string | null;
    project_type: ProjectType | null;
    mission_type: (typeof MISSION_TYPES)[number] | null;
    published: boolean;
    repo_url?: string | null;
    repo_note?: string | null;
    accent_color: null;
    cover_image_position: string;
    display_order: number;
  };
  blocks: { block_type: BlockType; title: string | null; content: string | null; display_order: number }[];
  errors: string[];
};

function s(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function nullify(v: string): string | null {
  return v === "" ? null : v;
}

function parseBool(v: string): boolean {
  const t = v.trim().toUpperCase();
  return t === "TRUE" || t === "VRAI" || t === "1" || t === "OUI";
}

function parseRow(raw: Record<string, string>, idx: number): ParsedRow {
  const errors: string[] = [];
  const title = s(raw["Titre"]);
  if (!title) errors.push("Titre vide");

  const typeRaw = s(raw["Type de projet"]);
  let project_type: ProjectType | null = null;
  let mission_type: (typeof MISSION_TYPES)[number] | null = null;
  if (MISSION_TYPES.includes(typeRaw as (typeof MISSION_TYPES)[number])) {
    project_type = "formation_mission";
    mission_type = typeRaw as (typeof MISSION_TYPES)[number];
  } else if (PROJECT_TYPES.includes(typeRaw as ProjectType)) {
    project_type = typeRaw as ProjectType;
  } else {
    errors.push(`Type de projet inconnu : "${typeRaw}"`);
  }

  const tags = s(raw["Stack (tags, séparés par virgule)"])
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const blocks: ParsedRow["blocks"] = [];
  for (let i = 1; i <= 10; i += 1) {
    const t = s(raw[`Bloc${i}_type`]);
    if (!t) continue;
    const mapped = BLOCK_TYPE_MAP[t.toLowerCase()];
    if (!mapped) {
      errors.push(`Bloc${i}_type inconnu : "${t}"`);
      continue;
    }
    const title = s(raw[`Bloc${i}_titre`]);
    const content = s(raw[`Bloc${i}_contenu`]);
    blocks.push({
      block_type: mapped,
      title: title || null,
      content: content || null,
      display_order: i - 1,
    });
  }

  return {
    rowIndex: idx,
    raw,
    project: {
      title,
      slug: s(raw["Slug (URL)"]) || undefined,
      emoji: nullify(s(raw["Emoji"])),
      tagline: nullify(s(raw["Tagline"])),
      role: nullify(s(raw["Rôle"])),
      angle: nullify(s(raw["Angle"])),
      status_label: nullify(s(raw["Statut"])),
      tags,
      impact: nullify(s(raw["Impact"])),
      project_type,
      mission_type,
      published: parseBool(s(raw["Publié (TRUE/FALSE)"])),
      repo_url: nullify(s(raw["Repo_url"])),
      repo_note: nullify(s(raw["Repo_note"])),
      accent_color: null,
      cover_image_position: "center",
      display_order: 0,
    },
    blocks,
    errors,
  };
}

function ImportPage() {
  const runImport = useServerFn(bulkImportProjects);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{
    created: { title: string; id: string; slug: string }[];
    failed: { title: string; error: string }[];
  } | null>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    setResult(null);
    Papa.parse<Record<string, string>>(f, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const parsed = res.data.map((r, i) => parseRow(r, i));
        setRows(parsed);
      },
      error: (err) => toast.error("Erreur de parsing CSV : " + err.message),
    });
  }

  const validRows = rows.filter((r) => r.errors.length === 0);
  const invalidCount = rows.length - validRows.length;

  async function doImport() {
    if (validRows.length === 0) {
      toast.error("Aucune ligne valide à importer");
      return;
    }
    setBusy(true);
    try {
      const payload = validRows.map((r) => ({
        project: {
          title: r.project.title,
          slug: r.project.slug,
          emoji: r.project.emoji,
          tagline: r.project.tagline,
          project_type: r.project.project_type as ProjectType,
          mission_type: r.project.mission_type,
          status_label: r.project.status_label,
          accent_color: r.project.accent_color,
          cover_image_position: r.project.cover_image_position,
          tags: r.project.tags,
          role: r.project.role,
          angle: r.project.angle,
          impact: r.project.impact,
          repo_url: r.project.repo_url,
          repo_note: r.project.repo_note,
          published: r.project.published,
          display_order: r.project.display_order,
        },
        blocks: r.blocks,
      }));
      const res = await runImport({ data: { rows: payload } });
      setResult(res);
      toast.success(`${res.created.length} projet(s) créé(s), ${res.failed.length} échec(s)`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error("Erreur : " + msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-8">
      <Link to="/admin" className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground">
        ← Retour
      </Link>
      <h1 className="mb-2 font-serif text-3xl font-bold text-foreground">Import en masse</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Upload d'un CSV avec les colonnes : Titre, Slug (URL), Emoji, Tagline, Rôle, Angle, Statut,
        Stack (tags, séparés par virgule), Impact, Type de projet, Publié (TRUE/FALSE), Repo_url,
        Repo_note, et jusqu'à 10 blocs (Bloc1_type / Bloc1_titre / Bloc1_contenu…).
      </p>

      <div className="mb-6 rounded-md border border-border bg-card p-4">
        <input type="file" accept=".csv" onChange={onFile} className="text-sm" />
        {fileName && <p className="mt-2 text-xs text-muted-foreground">Fichier : {fileName}</p>}
      </div>

      {rows.length > 0 && (
        <div className="mb-6">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="font-serif text-xl font-bold text-foreground">Aperçu</h2>
            <p className="text-sm text-muted-foreground">
              {validRows.length} valide(s), {invalidCount} invalide(s)
            </p>
          </div>
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">Titre</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Statut</th>
                  <th className="p-2 text-left">Blocs</th>
                  <th className="p-2 text-left">Publié</th>
                  <th className="p-2 text-left">Erreurs</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.rowIndex}
                    className={r.errors.length > 0 ? "bg-red-500/10 text-red-700 dark:text-red-400" : ""}
                  >
                    <td className="p-2">{r.rowIndex + 1}</td>
                    <td className="p-2">{r.project.title || <em>(vide)</em>}</td>
                    <td className="p-2">
                      {r.project.project_type}
                      {r.project.mission_type ? ` / ${r.project.mission_type}` : ""}
                    </td>
                    <td className="p-2">{r.project.status_label ?? "—"}</td>
                    <td className="p-2">{r.blocks.length}</td>
                    <td className="p-2">{r.project.published ? "oui" : "non"}</td>
                    <td className="p-2 text-xs">{r.errors.join("; ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={doImport}
            disabled={busy || validRows.length === 0}
            className="mt-4 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Import en cours…" : `Importer ${validRows.length} projet(s)`}
          </button>
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <div className="rounded-md border border-border bg-card p-4">
            <p className="font-medium text-foreground">
              {result.created.length} projet(s) créé(s) avec succès.
            </p>
            {result.failed.length > 0 && (
              <div className="mt-3">
                <p className="mb-1 font-medium text-red-600">{result.failed.length} échec(s) :</p>
                <ul className="list-disc pl-5 text-sm">
                  {result.failed.map((f, i) => (
                    <li key={i}>
                      <strong>{f.title}</strong> — {f.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Link to="/admin" className="inline-block rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-muted">
            Voir la liste
          </Link>
        </div>
      )}
    </div>
  );
}
