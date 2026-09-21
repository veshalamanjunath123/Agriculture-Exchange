import { createFileRoute } from "@tanstack/react-router";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Bug, Droplets, Leaf, TrendingUp, FlaskConical } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Progress } from "@/components/ui/progress";
import { agriPulse } from "@/lib/agri-data";

export const Route = createFileRoute("/ai-insights")({
  head: () => ({
    meta: [
      { title: "AgriPulse AI Insights — AgriXchange" },
      {
        name: "description",
        content:
          "AgriPulse turns pooled farm data into crop disease detection, irrigation timing, yield prediction, pest-risk alerts and fertiliser recommendations.",
      },
      { property: "og:title", content: "AgriPulse — regional agricultural intelligence" },
      {
        property: "og:description",
        content: "Rain in 18 hours, pest risk medium, delay irrigation 12 hours. Confidence 89%.",
      },
    ],
  }),
  component: AiInsights,
});

const models = [
  {
    icon: Leaf,
    title: "Crop disease detection",
    detail: "Leaf-image classifier over 42 crop-disease classes",
    output: "Cotton leaf curl suspected on 2 of your 6 plots",
    confidence: 84,
  },
  {
    icon: Droplets,
    title: "Irrigation recommendation",
    detail: "Soil moisture curve + 72-hour rainfall ensemble",
    output: "Delay irrigation by 12 hours — saves ~1,240 L/acre",
    confidence: 91,
  },
  {
    icon: TrendingUp,
    title: "Yield prediction",
    detail: "Regional NDVI, sowing date and input history",
    output: "18.4 quintal/acre projected (±1.6)",
    confidence: 78,
  },
  {
    icon: Bug,
    title: "Pest-risk alert",
    detail: "Neighbour sightings + temperature-humidity index",
    output: "Fall armyworm risk MEDIUM, rising to HIGH in 6 days",
    confidence: 86,
  },
  {
    icon: FlaskConical,
    title: "Fertiliser recommendation",
    detail: "Soil test + crop stage + target yield",
    output: "Split urea: 32 kg/acre now, 24 kg/acre after rain",
    confidence: 88,
  },
];

function AiInsights() {
  return (
    <>
      <PageHeader
        eyebrow="AI insights"
        title="AgriPulse — regional agricultural intelligence"
        description="One farm's sensors tell you about one farm. A block's shared sensors tell you what is about to happen. AgriPulse is the model layer on top of the exchange."
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="surface-dark overflow-hidden">
          <div className="border-b border-forest-foreground/10 px-6 py-5">
            <p className="mono-label text-lime">AgriPulse</p>
            <h2 className="mt-1 text-2xl font-bold">{agriPulse.region}</h2>
            <p className="mt-1 text-sm text-forest-foreground/70">
              {agriPulse.farmsContributing} farms · {agriPulse.sensors} sensors · AI confidence{" "}
              {agriPulse.confidence}%
            </p>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
            {agriPulse.metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-forest-foreground/10 bg-forest-foreground/5 p-5"
              >
                <p className="text-xs text-forest-foreground/60">{m.label}</p>
                <p className="mt-2 font-display text-3xl font-bold text-lime">{m.value}</p>
                <p className="mt-1 text-xs text-forest-foreground/55">{m.trend}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-4 px-6 pb-6 lg:grid-cols-3">
            {agriPulse.alerts.map((a) => (
              <div
                key={a.title}
                className="rounded-2xl border border-lime/25 bg-lime/10 p-5 text-forest-foreground"
              >
                <p className="text-lg">{a.icon}</p>
                <p className="mt-2 font-semibold">{a.title}</p>
                <p className="mt-1 text-sm text-forest-foreground/75">{a.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="surface p-6">
            <p className="mono-label text-primary">Soil moisture outlook</p>
            <h3 className="mt-2 text-lg font-semibold">Profile refills naturally on Saturday</h3>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={agriPulse.moistureSeries}>
                  <defs>
                    <linearGradient id="moist" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
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
                  <Area
                    type="monotone"
                    dataKey="moisture"
                    stroke="var(--color-chart-1)"
                    strokeWidth={3}
                    fill="url(#moist)"
                    name="Soil moisture %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="surface p-6">
            <p className="mono-label text-primary">Pest-risk index</p>
            <h3 className="mt-2 text-lg font-semibold">Fall armyworm pressure, last 5 weeks</h3>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agriPulse.pestSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="week" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                    }}
                  />
                  <Bar dataKey="risk" fill="var(--color-chart-4)" radius={[8, 8, 0, 0]} name="Risk index" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {models.map((m) => (
            <div key={m.title} className="surface p-6">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <m.icon className="size-5" />
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{m.title}</h3>
                  <p className="text-sm text-muted-foreground">{m.detail}</p>
                  <p className="mt-3 rounded-xl bg-secondary/60 p-3 text-sm font-medium">
                    {m.output}
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <Progress value={m.confidence} className="h-2" />
                    <span className="font-mono text-xs text-muted-foreground">
                      {m.confidence}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
