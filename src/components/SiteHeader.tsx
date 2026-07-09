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
              "rounded-full border border-[#1a1b2e] px-5 py-3 text-[#1a1b2e] transition-colors hover:bg-[#1a1b2e]/10",
              loc.pathname === "/profil" && "bg-[#1a1b2e] text-white hover:bg-[#1a1b2e]/90",
            )}
          >
            Profil
          </Link>
        </nav>
      </div>
    </header>
  );
}
