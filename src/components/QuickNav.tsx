import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type QuickNavSection = { id: string; label: string };

export function QuickNav({ sections }: { sections: QuickNavSection[] }) {
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

  if (sections.length === 0) return null;

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div
      className="sticky top-0 z-40 border-b border-border bg-card"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0, black 16px, black calc(100% - 16px), transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0, black 16px, black calc(100% - 16px), transparent 100%)",
      }}
    >
      <div
        className="mx-auto flex max-w-6xl touch-pan-x flex-nowrap gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain px-6 py-2.5 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollToSection(s.id)}
            className={cn(
              "min-h-[36px] shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              active === s.id
                ? "border-accent text-accent"
                : "border-border text-muted-foreground hover:border-accent hover:text-accent",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
