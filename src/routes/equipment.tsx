import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { resources } from "@/lib/agri-data";

export const Route = createFileRoute("/equipment")({
  head: () => ({
    meta: [
      { title: "Equipment Sharing — AgriXchange" },
      {
        name: "description",
        content:
          "Rent tractors, drones, harvesters, soil-testing kits and IoT devices by the day with an availability calendar and distance filtering.",
      },
      { property: "og:title", content: "Equipment sharing on AgriXchange" },
      {
        property: "og:description",
        content: "Availability calendar, distance filters and transparent rental pricing.",
      },
    ],
  }),
  component: EquipmentPage,
});

const types = ["All", "Tractors", "Drones", "Harvesters", "Soil testing", "IoT devices"] as const;

const typeMap: Record<string, string[]> = {
  Tractors: ["AGX-R-101", "AGX-R-102"],
  Drones: ["AGX-R-103"],
  Harvesters: ["AGX-R-107"],
  "Soil testing": ["AGX-R-110"],
  "IoT devices": ["AGX-R-104", "AGX-R-109"],
};

const days = [
  { d: 22, label: "Mon" },
  { d: 23, label: "Tue" },
  { d: 24, label: "Wed" },
  { d: 25, label: "Thu" },
  { d: 26, label: "Fri" },
  { d: 27, label: "Sat" },
  { d: 28, label: "Sun" },
];

function EquipmentPage() {
  const [type, setType] = useState<(typeof types)[number]>("All");
  const [radius, setRadius] = useState(25);

  const machines = resources.filter((r) => {
    const inType = type === "All" || typeMap[type]?.includes(r.id);
    const isMachine = ["Machinery", "Irrigation", "Labor", "Energy"].includes(r.category);
    return inType && isMachine && r.distanceKm <= radius;
  });

  return (
    <>
      <PageHeader
        eyebrow="Equipment sharing"
        title="A ₹12 lakh machine you only need for three days"
        description="Book machinery from farms around you by the day. Availability, condition history and on-time return rates are visible before you commit."
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="surface flex flex-wrap items-center gap-3 p-5">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={
                t === type
                  ? "rounded-full bg-forest px-4 py-2 text-sm font-medium text-forest-foreground"
                  : "rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary"
              }
            >
              {t}
            </button>
          ))}
          <div className="ml-auto flex w-full max-w-xs items-center gap-3">
            <span className="whitespace-nowrap text-sm text-muted-foreground">Distance</span>
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

        <div className="mt-6 grid gap-4">
          {machines.map((r) => (
            <article key={r.id} className="surface grid gap-6 p-6 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <div className="flex items-start gap-4">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-3xl">
                    {r.emoji}
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold">{r.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {r.owner} · {r.village} · {r.distanceKm} km away
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="secondary" className="rounded-full">
                        {r.category}
                      </Badge>
                      <Badge variant="secondary" className="rounded-full">
                        Condition: {r.condition}
                      </Badge>
                      <Badge variant="secondary" className="rounded-full">
                        {r.onTimeReturnRate}% on-time returns
                      </Badge>
                      <Badge variant="secondary" className="rounded-full">
                        ⭐ {r.rating} · {r.jobs} jobs
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-end gap-6">
                  <div>
                    <p className="mono-label text-primary">Rental price</p>
                    <p className="font-display text-3xl font-bold">
                      {r.price === 0 ? "Exchange" : `₹${r.price.toLocaleString("en-IN")}`}
                      {r.price === 0 ? null : (
                        <span className="text-base font-normal text-muted-foreground">
                          {" "}
                          / {r.unit}
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="mono-label text-primary">Crops suited</p>
                    <p className="mt-1 text-sm text-muted-foreground">{r.crops.join(", ")}</p>
                  </div>
                  <Button
                    className="ml-auto rounded-full"
                    onClick={() =>
                      toast.success(`Booking request sent to ${r.owner}`, {
                        description: `${r.title} · held in escrow until owner confirms.`,
                      })
                    }
                  >
                    Request booking
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-secondary/40 p-5">
                <p className="mono-label text-primary">Availability · September</p>
                <div className="mt-4 grid grid-cols-7 gap-2 text-center">
                  {days.map((d) => {
                    const from = Number(r.availableFrom.split(" ")[1]);
                    const to = Number(r.availableTo.split(" ")[1]);
                    const isSep = r.availableFrom.startsWith("Sep");
                    const free = isSep && d.d >= from && (Number.isNaN(to) || d.d <= Math.max(to, from));
                    return (
                      <div key={d.d}>
                        <p className="text-xs text-muted-foreground">{d.label}</p>
                        <div
                          className={
                            free
                              ? "mt-1 rounded-xl bg-primary py-2 text-sm font-semibold text-primary-foreground"
                              : "mt-1 rounded-xl bg-muted py-2 text-sm text-muted-foreground line-through"
                          }
                        >
                          {d.d}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Green days are open. Bookings lock the calendar automatically once the smart
                  contract is signed.
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
