import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

function serverPublicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverPublicClient();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
});

const settingsSchema = z.object({
  hero_title: z.string().min(1),
  hero_subtitle: z.string().min(1),
  hero_intro: z.string().min(1),
  cover_image_url: z.string().nullable().optional(),
  cover_image_alt_text: z.string().nullable().optional(),
  contact_email: z.string().email(),
  linkedin_url: z.string().nullable().optional(),
  featured_section_title: z.string().min(1),
  formations_section_title: z.string().min(1),
  missions_section_title: z.string().min(1),
  benevolat_section_title: z.string().min(1),
  tools_section_title: z.string().min(1),
  tools_json: z.array(z.object({ category: z.string(), items: z.array(z.string()) })),
  footer_text: z.string().min(1),
});

export const saveSiteSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => settingsSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { error } = await context.supabase
      .from("site_settings")
      .update({ ...data, tools_json: data.tools_json as never })
      .eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
