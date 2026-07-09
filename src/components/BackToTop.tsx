import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop({ afterId }: { afterId: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById(afterId);
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [afterId]);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Retour en haut de page"
      className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-opacity hover:opacity-90"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
