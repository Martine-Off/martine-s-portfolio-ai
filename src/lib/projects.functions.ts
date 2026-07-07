import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import { slugify } from "./utils/slug";

function serverPublicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

async function assertAdmin(ctx: { supabase: ReturnType<typeof serverPublicClient>; userId: string }) {
  const { data } = await ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "admin" });
  if (!data) throw new Error("Forbidden");
}

// ---------- Public read ----------

export const listPublishedProjects = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverPublicClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .neq("project_type", "profil")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getProjectBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const supabase = serverPublicClient();
    const { data: project, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .neq("project_type", "profil")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!project) return null;
    const { data: blocks } = await supabase
      .from("project_blocks")
      .select("*")
      .eq("project_id", project.id)
      .order("display_order", { ascending: true });
    return { project, blocks: blocks ?? [] };
  });

export const getProfilePage = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverPublicClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("project_type", "profil")
    .maybeSingle();
  if (!project) return null;
  const { data: blocks } = await supabase
    .from("project_blocks")
    .select("*")
    .eq("project_id", project.id)
    .order("display_order", { ascending: true });
  return { project, blocks: blocks ?? [] };
});

// ---------- Admin ----------

export const listAllProjects = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listStatusLabels = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("projects")
      .select("status_label")
      .not("status_label", "is", null);
    if (error) throw new Error(error.message);
    const set = new Set<string>();
    for (const row of data ?? []) {
      const v = (row.status_label ?? "").trim();
      if (v) set.add(v);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "fr"));
  });

export const getProjectByIdAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: project, error } = await context.supabase
      .from("projects")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!project) return null;
    const { data: blocks } = await context.supabase
      .from("project_blocks")
      .select("*")
      .eq("project_id", project.id)
      .order("display_order", { ascending: true });
    return { project, blocks: blocks ?? [] };
  });

const projectSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(1),
  slug: z.string().optional(),
  tagline: z.string().nullable().optional(),
  project_type: z.enum(["poc_perso", "production_client", "poc_ecole", "formation_mission", "profil"]),
  mission_type: z.enum(["formation", "mission", "benevolat"]).nullable().optional(),
  status_label: z.string().nullable().optional(),
  accent_color: z.string().nullable().optional(),
  cover_image_url: z.string().nullable().optional(),
  cover_image_alt_text: z.string().nullable().optional(),
  cover_image_position: z.string().default("center"),
  tags: z.array(z.string()).default([]),
  tags_categorises: z.any().nullable().optional(),
  summary: z.string().nullable().optional(),
  repo_url: z.string().nullable().optional(),
  repo_note: z.string().nullable().optional(),
  photo_profil_url: z.string().nullable().optional(),
  photo_profil_alt_text: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  impact: z.string().nullable().optional(),
  angle: z.string().nullable().optional(),
  emoji: z.string().nullable().optional(),
  published: z.boolean().default(false),
  display_order: z.number().default(0),
});

const blockSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  block_type: z.enum(["text", "video", "image", "quote", "heading", "liste", "comparatif"]),
  title: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  media_url: z.string().nullable().optional(),
  alt_text: z.string().nullable().optional(),
  caption: z.string().nullable().optional(),
  display_order: z.number().default(0),
});

async function ensureUniqueSlug(
  supabase: ReturnType<typeof serverPublicClient>,
  base: string,
  currentId?: string | null,
): Promise<string> {
  let candidate = base;
  let n = 2;
  while (true) {
    const query = supabase.from("projects").select("id").eq("slug", candidate).limit(1);
    const { data } = await query;
    const conflict = data && data[0] && data[0].id !== currentId;
    if (!conflict) return candidate;
    candidate = `${base}-${n}`;
    n += 1;
    if (n > 100) throw new Error("Impossible de générer un slug unique");
  }
}

type ProjectInput = z.infer<typeof projectSchema>;
type BlockInput = z.infer<typeof blockSchema>;

async function persistProjectWithBlocks(
  supabase: ReturnType<typeof serverPublicClient>,
  project: ProjectInput,
  blocks: BlockInput[],
) {
  const rawSlug = (project.slug && project.slug.trim()) || slugify(project.title);
  const slug = await ensureUniqueSlug(supabase, slugify(rawSlug), project.id ?? undefined);

  const payload = {
    title: project.title,
    slug,
    tagline: project.tagline ?? null,
    project_type: project.project_type,
    mission_type: project.project_type === "formation_mission" ? (project.mission_type ?? null) : null,
    status_label: project.status_label ?? null,
    accent_color: project.accent_color && project.accent_color.trim() ? project.accent_color : null,
    cover_image_url: project.cover_image_url ?? null,
    cover_image_alt_text: project.cover_image_alt_text ?? null,
    cover_image_position: project.cover_image_position || "center",
    tags: project.tags,
    tags_categorises: project.tags_categorises ?? null,
    summary: project.summary ?? null,
    repo_url: project.repo_url ?? null,
    repo_note: project.repo_note ?? null,
    photo_profil_url: project.project_type === "profil" ? (project.photo_profil_url ?? null) : null,
    photo_profil_alt_text: project.project_type === "profil" ? (project.photo_profil_alt_text ?? null) : null,
    role: project.role ?? null,
    impact: project.impact ?? null,
    angle: project.angle ?? null,
    emoji: project.emoji && project.emoji.trim() ? project.emoji.trim() : null,
    published: project.published,
    display_order: project.display_order,
  };

  let projectId = project.id ?? null;
  if (projectId) {
    const { error } = await supabase.from("projects").update(payload).eq("id", projectId);
    if (error) throw new Error(error.message);
  } else {
    const { data: inserted, error } = await supabase
      .from("projects")
      .insert(payload)
      .select("id")
      .single();
    if (error) {
      if (error.code === "23505" && error.message.includes("one_profil_only")) {
        throw new Error("Un profil existe déjà. Modifiez le profil existant plutôt que d'en créer un nouveau.");
      }
      if (error.code === "23505") {
        throw new Error("Ce slug est déjà utilisé. Modifiez-le.");
      }
      throw new Error(error.message);
    }
    projectId = inserted.id;
  }

  await supabase.from("project_blocks").delete().eq("project_id", projectId!);
  if (blocks.length > 0) {
    const rows = blocks.map((b, i) => ({
      project_id: projectId!,
      block_type: b.block_type,
      title: b.title ?? null,
      content: b.content ?? null,
      media_url: b.media_url ?? null,
      alt_text: b.alt_text ?? null,
      caption: b.caption ?? null,
      display_order: b.display_order ?? i,
    }));
    const { error: blockErr } = await supabase.from("project_blocks").insert(rows);
    if (blockErr) throw new Error(blockErr.message);
  }

  return { id: projectId!, slug };
}

export const saveProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({
      project: projectSchema,
      blocks: z.array(blockSchema),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { id, slug } = await persistProjectWithBlocks(context.supabase, data.project, data.blocks);
    return { ok: true, id, slug };
  });

export const bulkImportProjects = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({
      rows: z.array(
        z.object({
          project: projectSchema,
          blocks: z.array(blockSchema),
        }),
      ),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const created: { title: string; id: string; slug: string }[] = [];
    const failed: { title: string; error: string }[] = [];
    for (const row of data.rows) {
      try {
        const res = await persistProjectWithBlocks(context.supabase, row.project, row.blocks);
        created.push({ title: row.project.title, id: res.id, slug: res.slug });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        failed.push({ title: row.project.title || "(sans titre)", error: msg });
      }
    }
    return { created, failed };
  });

export const deleteProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("projects").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const togglePublished = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), published: z.boolean() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("projects")
      .update({ published: data.published })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const reorderProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), display_order: z.number() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("projects")
      .update({ display_order: data.display_order })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const createSignedUpload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ path: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: signed, error } = await context.supabase.storage
      .from("project-images")
      .createSignedUploadUrl(data.path);
    if (error) throw new Error(error.message);
    return signed;
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { isAdmin: !!data };
  });
