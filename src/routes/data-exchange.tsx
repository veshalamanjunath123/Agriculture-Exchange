import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { dataStreams, visibilityLevels, agriPulse, type Visibility } from "@/lib/agri-data";

export const Route = createFileRoute("/data-exchange")({
  head: () => ({
    meta: [
      { title: "Data Exchange — AgriXchange" },
      {
        name: "description",
        content:
          "Share soil moisture, weather, crop health, pest alerts and drone imagery on your own terms, with per-stream permissions from private to public.",
      },
      { property: "og:title", content: "Farm data exchange with real permissions" },
      {
        property: "og:description",
        content: "Private, cooperative, regional or public — you choose for every data stream.",
      },
    ],
  }),
  component: DataExchange,
});

const streamCards = [
  { name: "Soil moisture", value: "38%", contributors: "128 farms", emoji: "💧" },
  { name: "Weather", value: "29°C · rain 72%", contributors: "41 stations", emoji: "🌦" },
  { name: "Crop health", value: "NDVI 0.62", contributors: "86 farms", emoji: "🌿" },
  { name: "Pest alerts", value: "3 active", contributors: "19 reports", emoji: "🐛" },
  { name: "Satellite / drone", value: "12 new scans", contributors: "9 operators", emoji: "🛰" },
];

function DataExchange() {
  const [perm, setPerm] = useState<Record<string, Visibility>>(
    Object.fromEntries(dataStreams.map((s) => [s.id, s.visibility])),
  );

  const cycle = (id: string, name: string) => {
    const current: Visibility = perm[id] ?? "Private";
    const next: Visibility =
      visibilityLevels[(visibilityLevels.indexOf(current) + 1) % visibilityLevels.length] ??
      "Private";
    setPerm({ ...perm, [id]: next });
    toast.success(`${name} is now ${next}`, {
      description:
        next === "Private"
          ? "Only you can see this stream."
          : `Shared at ${next.toLowerCase()} level. You can revoke at any time.`,
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Data exchange"
        title="Your farm data stays yours — sharing is a choice, not a default"
        description="Contribute soil, weather, crop-health and pest data to regional dashboards. Every stream has its own visibility level, and every level is reversible."
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {streamCards.map((s) => (
            <div key={s.name} className="surface p-5">
              <span className="text-2xl">{s.emoji}</span>
              <p className="mt-3 text-sm text-muted-foreground">{s.name}</p>
              <p className="font-display text-xl font-bold">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.contributors} contributing</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="surface p-6">
            <p className="mono-label text-primary">Regional dashboard · {agriPulse.region}</p>
            <h2 className="mt-2 text-xl font-semibold">Pooled soil moisture vs rainfall</h2>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={agriPulse.moistureSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="moisture"
                    stroke="var(--color-chart-1)"
                    strokeWidth={3}
                    dot={false}
                    name="Soil moisture %"
                  />
                  <Line
                    type="monotone"
                    dataKey="rain"
                    stroke="var(--color-chart-3)"
                    strokeWidth={3}
                    dot={false}
                    name="Rain mm"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Built from {agriPulse.sensors} sensors across {agriPulse.farmsContributing} farms. No
              individual farm is identifiable in the regional view.
            </p>
          </div>

          <div className="surface p-6">
            <p className="mono-label text-primary">My data permissions</p>
            <h2 className="mt-2 text-xl font-semibold">Tap a level to change it</h2>
            <div className="mt-6 grid gap-3">
              {dataStreams.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border p-4"
                >
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {perm[s.id] === "Private" ? "Shared with — " : `Shared with ${s.sharedWith}`}
                    </p>
                  </div>
                  <button onClick={() => cycle(s.id, s.name)}>
                    <Badge
                      className={
                        perm[s.id] === "Private"
                          ? "rounded-full bg-muted text-muted-foreground"
                          : perm[s.id] === "Public"
                            ? "rounded-full bg-lime text-lime-foreground"
                            : "rounded-full bg-primary text-primary-foreground"
                      }
                    >
                      {perm[s.id]}
                    </Badge>
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              Private → Cooperative → Regional → Public. Revoking a level stops future sharing
              immediately; past contributions remain anonymised in aggregates.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
