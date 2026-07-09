import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function SiteHeader({ heroTitle }: { heroTitle: string }) {
  const loc = useLocation();
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-serif text-lg font-bold text-foreground">
          {heroTitle}
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            to="/"
            className={cn(
              "transition-colors hover:text-foreground",
              loc.pathname === "/" ? "text-foreground" : "text-muted-foreground",
            )}
          >
            Accueil
          </Link>
          <Link
            to="/profil"
            className="flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Profil
          </Link>
        </nav>
      </div>
    </header>
  );
}
