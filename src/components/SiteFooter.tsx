import { Link } from "@tanstack/react-router";

export function SiteFooter({ footerText, email, linkedinUrl }: { footerText: string; email: string; linkedinUrl?: string | null }) {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col px-6 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">{footerText}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {linkedinUrl && (
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                LinkedIn
              </a>
            )}
            {!linkedinUrl && email && (
              <a href={`mailto:${email}`} className="text-accent hover:underline">
                {email}
              </a>
            )}
            <Link to="/auth" className="text-xs text-muted-foreground hover:text-foreground">
              Connexion
            </Link>
          </div>
        </div>
        <p className="mt-6 text-[13px] leading-relaxed text-muted-foreground md:mt-8">
          Portfolio conçu et développé avec Lovable, Claude Code et Gemini Pro - architecture, design system et contenu pilotés de bout en bout.
        </p>
      </div>
    </footer>
  );
}