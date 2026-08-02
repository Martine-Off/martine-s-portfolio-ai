import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "@/lib/analytics.functions";

export const Route = createFileRoute("/_authenticated/admin/stats")({
  head: () => ({ meta: [{ title: "Statistiques de visites" }] }),
  component: StatsPage,
});

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-1 font-serif text-3xl font-bold text-foreground">{value}</div>
    </div>
  );
}

function StatsPage() {
  const fetchStats = useServerFn(getAnalytics);
  const q = useQuery({ queryKey: ["admin", "analytics"], queryFn: () => fetchStats() });

  const data = q.data;
  const maxDaily = Math.max(1, ...(data?.daily.map((d) => d.count) ?? [1]));

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
          Statistiques de visites
        </h1>
        <Link
          to="/admin"
          className="min-h-11 inline-flex items-center rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-muted"
        >
          Retour à l'administration
        </Link>
      </div>

      {q.isLoading && <p className="text-muted-foreground">Chargement…</p>}
      {q.isError && (
        <p className="text-destructive">Impossible de charger les statistiques.</p>
      )}

      {data && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="7 derniers jours" value={data.totals.last7} />
            <StatCard label="30 derniers jours" value={data.totals.last30} />
            <StatCard label="Depuis le début" value={data.totals.all} />
          </div>

          <section className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-4 font-serif text-lg font-bold text-foreground">
              Vues par jour (30 derniers jours)
            </h2>
            <div className="flex h-40 items-end gap-1">
              {data.daily.map((d) => (
                <div key={d.date} className="group flex flex-1 flex-col items-center justify-end">
                  <div
                    title={`${d.date} — ${d.count} vue(s)`}
                    className="w-full rounded-t bg-accent transition-opacity hover:opacity-80"
                    style={{ height: `${Math.max(2, (d.count / maxDaily) * 100)}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>{data.daily[0]?.date}</span>
              <span>{data.daily[data.daily.length - 1]?.date}</span>
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            <section className="rounded-lg border border-border bg-card p-4">
              <h2 className="mb-3 font-serif text-lg font-bold text-foreground">
                Top 5 des pages
              </h2>
              {data.topPages.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune donnée.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {data.topPages.map((p) => (
                    <li key={p.path} className="flex justify-between gap-3 border-b border-border pb-2 last:border-0">
                      <span className="truncate text-foreground">{p.path}</span>
                      <span className="shrink-0 font-medium text-muted-foreground">{p.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-lg border border-border bg-card p-4">
              <h2 className="mb-3 font-serif text-lg font-bold text-foreground">
                Top 5 des référents
              </h2>
              {data.topReferrers.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun référent enregistré.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {data.topReferrers.map((r) => (
                    <li key={r.referrer} className="flex justify-between gap-3 border-b border-border pb-2 last:border-0">
                      <span className="truncate text-foreground">{r.referrer}</span>
                      <span className="shrink-0 font-medium text-muted-foreground">{r.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
