import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type AnalyticsStats = {
  totals: { last7: number; last30: number; all: number };
  topPages: { path: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  daily: { date: string; count: number }[];
};

export const getAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AnalyticsStats> => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { data, error } = await context.supabase
      .from("page_views")
      .select("path, referrer, created_at")
      .order("created_at", { ascending: false })
      .limit(50000);
    if (error) throw new Error(error.message);

    const rows = data ?? [];
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    const totals = {
      all: rows.length,
      last7: rows.filter((r) => now - new Date(r.created_at).getTime() <= 7 * day).length,
      last30: rows.filter((r) => now - new Date(r.created_at).getTime() <= 30 * day).length,
    };

    const count = <T extends string>(values: T[]) => {
      const map = new Map<string, number>();
      for (const v of values) map.set(v, (map.get(v) ?? 0) + 1);
      return [...map.entries()].sort((a, b) => b[1] - a[1]);
    };

    const topPages = count(rows.map((r) => r.path))
      .slice(0, 5)
      .map(([path, c]) => ({ path, count: c }));

    const topReferrers = count(
      rows
        .map((r) => (r.referrer ?? "").trim())
        .filter(Boolean)
        .map((r) => {
          try {
            return new URL(r).hostname;
          } catch {
            return r;
          }
        }),
    )
      .slice(0, 5)
      .map(([referrer, c]) => ({ referrer, count: c }));

    const dailyMap = new Map<string, number>();
    for (let i = 29; i >= 0; i--) {
      dailyMap.set(new Date(now - i * day).toISOString().slice(0, 10), 0);
    }
    for (const r of rows) {
      const key = new Date(r.created_at).toISOString().slice(0, 10);
      if (dailyMap.has(key)) dailyMap.set(key, (dailyMap.get(key) ?? 0) + 1);
    }
    const daily = [...dailyMap.entries()].map(([date, c]) => ({ date, count: c }));

    return { totals, topPages, topReferrers, daily };
  });
