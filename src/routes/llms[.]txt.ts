import { createFileRoute } from "@tanstack/react-router";
import { getSiteSettings } from "@/lib/settings.functions";
import { listPublishedProjects, getProfilePage } from "@/lib/projects.functions";
import { SITE_URL } from "@/config";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const base = SITE_URL;
        const settings = await getSiteSettings();
        const projects = await listPublishedProjects();
        const profile = await getProfilePage();
        
        let text = `# Martine Desmaroux\n\n`;
        text += `Je suis Martine Desmaroux, ${settings?.hero_subtitle || "Cheffe de projet IA"}.\n`;
        text += `${settings?.hero_intro || ""}\n\n`;
        
        if (profile?.project?.summary || profile?.project?.tagline) {
          text += `## À propos\n${profile.project.summary || profile.project.tagline}\n\n`;
        }
        
        text += `## Pages du site\n`;
        text += `- Accueil : ${base}/\n`;
        text += `- Profil détaillé : ${base}/profil\n`;
        
        const withPage = (projects || []).filter((p) => p.project_type !== "formation_mission");
        
        if (withPage.length > 0) {
          text += `\n## Projets publiés\n`;
          for (const p of withPage) {
            text += `\n### ${p.title.replace(/\|\|/g, " ").replace(/\s+/g, " ").trim()}\n`;
            text += `- URL : ${base}/projets/${p.slug}\n`;
            if (p.tagline) text += `- Résumé : ${p.tagline}\n`;
            if (p.tags && p.tags.length > 0) text += `- Technologies/Tags : ${p.tags.join(", ")}\n`;
          }
        }
        
        return new Response(text, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
