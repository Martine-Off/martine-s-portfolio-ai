import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function SiteHeader({ heroTitle }: { heroTitle: string }) {
  const loc = useLocation();
  const onProfil = loc.pathname === "/profil";
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
            className={cn(
              "rounded-full border px-4 py-1.5 font-medium transition-colors",
              onProfil
                ? "border-primary bg-primary text-primary-foreground"
                : "border-primary text-primary hover:bg-primary hover:text-primary-foreground",
            )}
          >
            Profil
          </Link>
        </nav>
      </div>
    </header>
  );
}
