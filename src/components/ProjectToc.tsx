import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type ProjectTocSection = { id: string; label: string };

export function ProjectToc({ sections, className }: { sections: ProjectTocSection[]; className?: string }) {
  const [active, setActive] = useState<string | null>(sections[0]?.id ?? null);

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        );
        setActive(topMost.target.id);
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  if (sections.length < 2) return null;

  function onClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  }

  return (
    <nav
      className={cn(
        "sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-[0_2px_16px_rgba(26,27,46,0.10)]",
        className,
      )}
      aria-label="Sommaire"
    >
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Sommaire</p>
      <ul className="space-y-1">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              onClick={(e) => onClick(e, s.id)}
              className={cn(
                "block border-l-2 py-1 pl-3 text-sm leading-snug transition-colors",
                active === s.id
                  ? "border-accent text-accent font-medium"
                  : "border-border text-muted-foreground hover:border-accent hover:text-accent",
              )}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
