import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mapPoints, modes, resources, type ListingMode, type MapPoint } from "@/lib/agri-data";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Resource Map — AgriXchange" },
      {
        name: "description",
        content:
          "An interactive map of nearby machinery, water resources, seed suppliers, farmers, storage facilities and renewable energy.",
      },
      { property: "og:title", content: "AgriXchange resource map" },
      {
        property: "og:description",
        content: "See every shareable resource around your farm, filtered by distance and type.",
      },
    ],
  }),
  component: ResourceMap,
});

const kinds: Array<MapPoint["kind"] | "All"> = [
  "All",
  "Machinery",
  "Water",
  "Seeds",
  "Farmer",
  "Storage",
  "Energy",
];

function ResourceMap() {
  const [selected, setSelected] = useState<MapPoint["kind"][]>([
    "Machinery",
    "Water",
    "Seeds",
    "Farmer",
    "Storage",
    "Energy",
  ]);
  const [radius, setRadius] = useState(25);
  const [active, setActive] = useState<MapPoint | null>(mapPoints[0] ?? null);
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(8000);
  const [minRating, setMinRating] = useState(0);
  const [mode, setMode] = useState<"All" | ListingMode>("All");

  const q = query.trim().toLowerCase();

  const visible = mapPoints.filter(
    (p) =>
      selected.includes(p.kind) &&
      p.distanceKm <= radius &&
      (q === "" || `${p.label} ${p.detail} ${p.kind}`.toLowerCase().includes(q)),
  );

  const listings = resources.filter(
    (r) =>
      r.distanceKm <= radius &&
      (r.price === 0 || r.price <= maxPrice) &&
      r.rating >= minRating &&
      (mode === "All" || r.mode.includes(mode)) &&
      (q === "" || `${r.title} ${r.owner} ${r.village} ${r.category}`.toLowerCase().includes(q)),
  );

  const activeResource = active
    ? resources.find((r) =>
        r.title.toLowerCase().includes((active.label.toLowerCase().split(" ")[0] ?? "").slice(0, 6)),
      )
    : undefined;

  function toggle(kind: MapPoint["kind"]) {
    setSelected((s) => (s.includes(kind) ? s.filter((k) => k !== kind) : [...s, kind]));
  }

  return (
    <>
      <PageHeader
        eyebrow="Resource map"
        title="Everything shareable within reach of your gate"
        description="Your farm sits at the centre. Each pin is a resource another farmer has offered to the exchange, positioned by road distance from you."
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="surface grid gap-5 p-5">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search equipment, seeds, farmers, villages…"
            className="h-12 rounded-xl"
          />

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <p className="mono-label text-primary">Filters</p>
            {kinds
              .filter((k): k is MapPoint["kind"] => k !== "All")
              .map((k) => (
                <label key={k} className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox checked={selected.includes(k)} onCheckedChange={() => toggle(k)} />
                  {k}
                </label>
              ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
            <span className="whitespace-nowrap text-sm text-muted-foreground">Distance</span>
            {[5, 10, 20, 30].map((d) => (
              <button
                key={d}
                onClick={() => setRadius(d)}
                className={
                  radius === d
                    ? "rounded-full bg-forest px-4 py-2 text-sm font-medium text-forest-foreground"
                    : "rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary"
                }
              >
                {d} km
              </button>
            ))}
            <div className="ml-auto flex w-full max-w-xs items-center gap-3">
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

          <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Max price</span>
                <span className="font-mono text-muted-foreground">
                  ₹{maxPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <Slider
                value={[maxPrice]}
                min={500}
                max={12000}
                step={100}
                onValueChange={(v) => setMaxPrice(v[0] ?? maxPrice)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Minimum rating</span>
                <span className="font-mono text-muted-foreground">
                  {minRating === 0 ? "any" : `${minRating.toFixed(1)}★`}
                </span>
              </div>
              <Slider
                value={[minRating]}
                min={0}
                max={5}
                step={0.1}
                onValueChange={(v) => setMinRating(v[0] ?? minRating)}
              />
            </div>
            <div className="grid gap-2">
              <span className="text-sm text-muted-foreground">Listing type</span>
              <div className="flex flex-wrap gap-2">
                {(["All", ...modes] as Array<"All" | ListingMode>).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={
                      mode === m
                        ? "rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                        : "rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary"
                    }
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="surface relative aspect-[4/3] overflow-hidden">
            <div className="bg-field-grid absolute inset-0 bg-secondary/40" />
            {/* stylised canal */}
            <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M -5 78 C 20 70, 40 88, 62 72 S 88 58, 105 66"
                fill="none"
                stroke="var(--color-water)"
                strokeWidth="2.4"
                opacity="0.5"
              />
              <path
                d="M -5 30 C 25 40, 45 18, 70 30 S 92 44, 105 36"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="0.8"
                strokeDasharray="3 3"
                opacity="0.4"
              />
            </svg>

            {/* radius rings around own farm */}
            <div className="absolute left-1/2 top-1/2 size-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/30" />
            <div className="absolute left-1/2 top-1/2 size-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20" />

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="flex size-10 items-center justify-center rounded-full bg-forest text-lg text-forest-foreground shadow-lift">
                🏡
              </span>
              <span className="mono-label mt-1 block text-primary">Your farm</span>
            </div>

            {visible.map((p) => (
              <button
                key={p.id}
                onClick={() => setActive(p)}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                className={
                  "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-1.5 text-sm shadow-soft transition-transform hover:scale-110 " +
                  (active?.id === p.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-card-foreground")
                }
                title={p.label}
              >
                {p.emoji}
              </button>
            ))}
          </div>

          <div className="grid gap-4">
            {active ? (
              <div className="surface p-6">
                <p className="mono-label text-primary">Selected pin</p>
                <p className="mt-2 flex items-center gap-2 text-lg font-semibold">
                  <span className="text-2xl">{active.emoji}</span>
                  {active.label}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{active.detail}</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {active.kind} · {active.distanceKm} km from your farm (approximate location)
                </p>
                {activeResource ? (
                  <div className="mt-4 grid gap-2">
                    <p className="text-sm text-muted-foreground">
                      ⭐ {activeResource.rating} · Available {activeResource.availableFrom} –{" "}
                      {activeResource.availableTo}
                    </p>
                    <Button asChild className="rounded-full">
                      <Link to="/resource/$id" params={{ id: activeResource.id }}>
                        View details
                      </Link>
                    </Button>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="surface p-5">
              <p className="mono-label text-primary">{visible.length} resources in range</p>
              <div className="mt-3 grid max-h-96 gap-1 overflow-y-auto">
                {visible.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActive(p)}
                    className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-secondary"
                  >
                    <span className="flex items-center gap-2">
                      <span>{p.emoji}</span>
                      {p.label}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {p.distanceKm} km
                    </span>
                  </button>
                ))}
                {visible.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border p-6 text-center">
                    <p className="text-2xl">📍</p>
                    <p className="mt-2 font-medium">No resources found</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Try increasing your search radius or clearing the search box.
                    </p>
                    <Button
                      className="mt-4 rounded-full"
                      onClick={() => {
                        setRadius(30);
                        setQuery("");
                      }}
                    >
                      Increase distance
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Matching listings under the current filters */}
        <div className="mt-6">
          <p className="mono-label text-primary">{listings.length} matching listings</p>
          {listings.length === 0 ? (
            <div className="surface mt-3 p-8 text-center">
              <p className="text-2xl">🔍</p>
              <p className="mt-2 font-medium">Nothing matches these filters</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Raise your price ceiling, lower the minimum rating or widen the distance.
              </p>
              <Button
                className="mt-4 rounded-full"
                onClick={() => {
                  setMaxPrice(12000);
                  setMinRating(0);
                  setMode("All");
                  setRadius(30);
                  setQuery("");
                }}
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((r) => (
                <div key={r.id} className="surface p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-2xl">{r.emoji}</span>
                    <Badge variant="secondary" className="rounded-full">
                      {r.mode.join(" · ")}
                    </Badge>
                  </div>
                  <p className="mt-3 font-semibold leading-tight">{r.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {r.owner} · {r.distanceKm} km away
                  </p>
                  <p className="mt-2 text-sm">
                    <span className="font-semibold">
                      {r.price === 0 ? "Exchange" : `₹${r.price.toLocaleString("en-IN")}/${r.unit}`}
                    </span>{" "}
                    · ⭐ {r.rating} · 🟢 {r.availableFrom}–{r.availableTo}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button asChild size="sm" className="rounded-full">
                      <Link to="/resource/$id" params={{ id: r.id }}>
                        View details
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="secondary" className="rounded-full">
                      <Link to="/resource/$id" params={{ id: r.id }}>
                        Request
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
