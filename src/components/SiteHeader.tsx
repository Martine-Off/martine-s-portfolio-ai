import { Link } from "@tanstack/react-router";
import { safeHref } from "@/lib/utils/safe-url";

export function SiteHeader({
  heroTitle,
  linkedinUrl,
}: {
  heroTitle: string;
  linkedinUrl?: string | null;
}) {
  const safeLinkedin = safeHref(linkedinUrl);
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-serif text-lg font-bold text-foreground">
          {heroTitle}
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            to="/profil"
            className="flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Profil
          </Link>
          {safeLinkedin && (
            <a
              href={safeLinkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Me contacter sur LinkedIn
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}

