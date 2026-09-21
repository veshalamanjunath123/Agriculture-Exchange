import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { ResourceCard } from "@/components/resource-card";
import { resources, categories, modes, type Category, type ListingMode } from "@/lib/agri-data";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — AgriXchange" },
      {
        name: "description",
        content:
          "Buy, sell, rent or exchange equipment, seeds, fertiliser, irrigation, energy, storage and labour with verified farmers nearby.",
      },
      { property: "og:title", content: "AgriXchange Marketplace" },
      {
        property: "og:description",
        content: "A modern marketplace for farm machinery, inputs, water, energy and services.",
      },
    ],
  }),
  component: Marketplace,
});

function Marketplace() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<ListingMode | "All">("All");
  const [category, setCategory] = useState<Category | "All">("All");
  const [radius, setRadius] = useState(25);

  const filtered = useMemo(
    () =>
      resources.filter((r) => {
        const q = query.trim().toLowerCase();
        const matchesQuery =
          q.length === 0 ||
          r.title.toLowerCase().includes(q) ||
          r.owner.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q);
        const matchesMode = mode === "All" || r.mode.includes(mode);
        const matchesCategory = category === "All" || r.category === category;
        return matchesQuery && matchesMode && matchesCategory && r.distanceKm <= radius;
      }),
    [query, mode, category, radius],
  );

  return (
    <>
      <PageHeader
        eyebrow="Marketplace"
        title="Everything a farm needs, from the farms around you"
        description="Machinery, seeds, fertiliser, irrigation, solar energy, storage and labour — listed by verified farmers and cooperatives in your block."
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="surface p-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tractors, seeds, drones, water..."
              className="h-14 rounded-2xl pl-12 text-base"
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {(["All", ...modes] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={
                  m === mode
                    ? "rounded-full bg-forest px-4 py-2 text-sm font-medium text-forest-foreground"
                    : "rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary"
                }
              >
                {m}
              </button>
            ))}
            <div className="ml-auto flex w-full max-w-xs items-center gap-3">
              <Label className="whitespace-nowrap text-sm text-muted-foreground">Within</Label>
              <Slider
                value={[radius]}
                min={2}
                max={30}
                step={1}
                onValueChange={(v) => setRadius(v[0] ?? radius)}
              />
              <span className="w-14 font-mono text-sm text-muted-foreground">{radius} km</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
            {(["All", ...categories] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={
                  c === category
                    ? "rounded-full bg-lime px-3.5 py-1.5 text-sm font-medium text-lime-foreground"
                    : "rounded-full bg-secondary px-3.5 py-1.5 text-sm text-secondary-foreground hover:bg-muted"
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          {filtered.length} listing{filtered.length === 1 ? "" : "s"} within {radius} km
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((r) => (
            <ResourceCard
              key={r.id}
              resource={r}
              onRequest={(res) =>
                toast.success(`Request sent to ${res.owner}`, {
                  description: `${res.title} · escrow contract created, awaiting owner confirmation.`,
                })
              }
            />
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            Nothing matches yet. Try a wider radius or a different category.
          </div>
        ) : null}
      </section>
    </>
  );
}
