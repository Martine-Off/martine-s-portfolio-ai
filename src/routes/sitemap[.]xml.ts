import { createFileRoute } from "@tanstack/react-router";
import { getRequestHost, getRequestHeader } from "@tanstack/react-start/server";
import { listPublishedProjects } from "@/lib/projects.functions";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const host = getRequestHost();
        const proto = getRequestHeader("x-forwarded-proto") ?? "https";
        const base = `${proto}://${host}`;

        const projects = await listPublishedProjects();
        // Exclude formation_mission (no dedicated page)
        const withPage = projects.filter((p) => p.project_type !== "formation_mission");

        const now = new Date().toISOString().slice(0, 10);
        const entries: { path: string; changefreq: string; priority: string; lastmod?: string }[] = [
          { path: "/", changefreq: "weekly", priority: "1.0", lastmod: now },
          { path: "/profil", changefreq: "monthly", priority: "0.8", lastmod: now },
          ...withPage.map((p) => ({
            path: `/projets/${p.slug}`,
            changefreq: "monthly",
            priority: "0.7",
            lastmod: (p.updated_at ?? p.created_at ?? now).slice(0, 10),
          })),
        ];

        const urls = entries
          .map(
            (e) =>
              `  <url>\n    <loc>${base}${e.path}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
