import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_FLAG = "portfolio_admin";

/**
 * Tracking de visites 100 % interne.
 * - Pose le flag d'auto-exclusion si l'URL contient ?admin=true (puis nettoie l'URL)
 * - N'enregistre rien si localStorage.portfolio_admin === "true"
 */
export function PageViewTracker() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Auto-exclusion via ?admin=true
    const url = new URL(window.location.href);
    if (url.searchParams.get("admin") === "true") {
      try {
        localStorage.setItem(ADMIN_FLAG, "true");
      } catch {
        /* stockage indisponible */
      }
      url.searchParams.delete("admin");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    }

    // 2. Ne rien tracker si exclue
    let excluded = false;
    try {
      excluded = localStorage.getItem(ADMIN_FLAG) === "true";
    } catch {
      excluded = false;
    }
    if (excluded) return;

    // 3. Pas de tracking de l'admin
    if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return;

    supabase
      .from("page_views")
      .insert({
        path: pathname,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
      })
      .then(({ error }) => console.log("[track]", pathname, error?.message ?? "ok"));
  }, [pathname]);

  return null;
}
