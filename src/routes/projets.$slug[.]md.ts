import { createFileRoute } from "@tanstack/react-router";
import { getProjectBySlug } from "@/lib/projects.functions";
import { BlockWithTitle } from "@/lib/supabase.types";

export const Route = createFileRoute("/projets/$slug.md")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        // Sécurité supplémentaire : on s'assure que .md n'a pas été capturé dans le slug
        const cleanSlug = params.slug.replace(/\.md$/, "");
        
        try {
          const data = await getProjectBySlug({ data: { slug: cleanSlug } });
          
          if (!data || !data.project) {
            return new Response("Projet introuvable", { status: 404 });
          }
          
          const p = data.project;
          const blocks = data.blocks || [];
          
          let md = `# ${p.title.replace(/\|\|/g, " ").replace(/\s+/g, " ").trim()}\n\n`;
          
          if (p.tagline) md += `**${p.tagline}**\n\n`;
          
          md += `## Informations clés\n`;
          if (p.project_date) md += `- **Date / Période :** ${p.project_date}\n`;
          if (p.status_label) md += `- **Statut :** ${p.status_label}\n`;
          if (p.role) md += `- **Rôle :** ${p.role}\n`;
          if (p.impact) md += `- **Impact :** ${p.impact}\n`;
          if (p.tags && p.tags.length > 0) md += `- **Tags / Tech :** ${p.tags.join(", ")}\n`;
          
          md += `\n## Contenu détaillé\n\n`;
          
          for (const b of blocks as any[]) {
            if (b.block_type === "heading" && b.title) {
              md += `### ${b.title}\n\n`;
            } else if (b.block_type === "text" && b.content) {
              // On supprime les balises HTML si le contenu en contient (ou on les laisse telles quelles si on suppose que c'est du texte brut / markdown)
              // Vu qu'on veut "sans HTML", utilisons un petit regex pour le nettoyage HTML simple
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
        } catch (err: any) {
          return new Response("Erreur lors de la récupération du projet", { status: 500 });
        }
      },
    },
  },
});
