import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname.startsWith("/projets/") && url.pathname.endsWith(".md")) {
        const slug = url.pathname.slice("/projets/".length, -3);
        const { createClient } = await import("@supabase/supabase-js");
        const supabaseUrl = process.env.SUPABASE_URL || (env as any)?.VITE_SUPABASE_URL || "";
        const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || (env as any)?.VITE_SUPABASE_PUBLISHABLE_KEY || "";
        
        if (supabaseUrl && supabaseKey) {
          const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
          const { data: project } = await supabase.from("projects").select("*").eq("slug", slug).single();
          
          if (project) {
            const { data: blocks } = await supabase.from("project_blocks").select("*").eq("project_id", project.id).order("order_index");
            
            let md = `# ${project.title.replace(/\|\|/g, " ").replace(/\s+/g, " ").trim()}\n\n`;
            if (project.tagline) md += `**${project.tagline}**\n\n`;
            
            md += `## Informations clés\n`;
            if (project.project_date) md += `- **Date / Période :** ${project.project_date}\n`;
            if (project.status_label) md += `- **Statut :** ${project.status_label}\n`;
            if (project.role) md += `- **Rôle :** ${project.role}\n`;
            if (project.impact) md += `- **Impact :** ${project.impact}\n`;
            
            md += `\n## Contenu détaillé\n\n`;
            
            for (const b of blocks || []) {
              if (b.block_type === "heading" && b.title) {
                md += `### ${b.title}\n\n`;
              } else if (b.block_type === "text" && b.content) {
                const cleanContent = b.content.replace(/<[^>]*>?/gm, '');
                md += `${cleanContent}\n\n`;
              } else if (b.block_type === "quote" && b.content) {
                const cleanContent = b.content.replace(/<[^>]*>?/gm, '');
                md += `> "${cleanContent}"\n\n`;
              } else if (b.block_type === "liste" && b.content) {
                const cleanContent = b.content.replace(/<[^>]*>?/gm, '');
                md += `${cleanContent}\n\n`;
              } else if (b.block_type === "comparatif" && b.content) {
                const cleanContent = b.content.replace(/<[^>]*>?/gm, '');
                md += `${cleanContent}\n\n`;
              } else if (b.block_type === "video") {
                const caption = b.caption || b.alt_text || "Vidéo démonstrative";
                md += `[Vidéo : ${caption}]\n\n`;
              } else if (b.block_type === "image") {
                const caption = b.caption || b.alt_text || "Image illustrant le projet";
                md += `[Image : ${caption}]\n\n`;
              }
            }
            
            return new Response(md, {
              headers: {
                "Content-Type": "text/markdown; charset=utf-8",
                "Cache-Control": "public, max-age=3600",
              },
            });
          }
        }
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
