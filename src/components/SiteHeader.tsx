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
        <nav className="flex items-center gap-6 text-sm">
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
            className={cn(
              "transition-colors hover:text-foreground",
              loc.pathname === "/profil" ? "text-foreground" : "text-muted-foreground",
            )}
          >
            Profil
          </Link>
        </nav>
      </div>
    </header>
  );
}
