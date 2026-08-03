import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const trackSchema = z.object({
  path: z
    .string()
    .trim()
    .min(1)
    .max(512)
    .regex(/^\/[^\s]*$/, "invalid path"),
  referrer: z.string().trim().max(1024).nullish(),
  userAgent: z.string().trim().max(512).nullish(),
});

/**
 * Enregistrement d'une vue de page côté serveur.
 * Le client n'a plus le droit d'écrire directement dans `page_views` :
 * les données sont validées ici avant insertion.
 */
export const trackPageView = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => trackSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.from("page_views").insert({
      path: data.path,
      referrer: data.referrer?.slice(0, 1024) || null,
      user_agent: data.userAgent?.slice(0, 512) || null,
    });

    if (error) {
      console.error("[track] insert failed", error.message);
      return { ok: false as const };
    }
    return { ok: true as const };
  });
