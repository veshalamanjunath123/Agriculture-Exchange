import { createFileRoute, Link } from "@tanstack/react-router";
import { Droplets, CloudRain, Sprout, ArrowUpRight, Brain, MapPin, Phone } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { agriPulse, dataStreams, ledger, mapPoints, resources } from "@/lib/agri-data";
import { activeBooking, bookingStages, useSession } from "@/lib/session";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Farmer Dashboard — AgriXchange" },
      {
        name: "description",
        content:
          "Your farm at a glance: soil moisture, weather, AI recommendations, listings, active rentals, transactions, shared data and environmental impact.",
      },
      { property: "og:title", content: "Your AgriXchange farm dashboard" },
      {
        property: "og:description",
        content: "AI recommendations, nearby resources and measured savings in one view.",
      },
    ],
  }),
  component: Dashboard,
});

const myListings = resources.filter((r) => ["AGX-R-103", "AGX-R-109"].includes(r.id));

const impact = [
  { icon: "💧", value: "1,240 L", label: "Water saved this week" },
  { icon: "💰", value: "₹1,850", label: "Cost avoided" },
  { icon: "🌱", value: "3", label: "Resources shared out" },
  { icon: "🤝", value: "7", label: "Farmers connected" },
];

function Dashboard() {
  const { profile, bookings } = useSession();
  const rental = activeBooking(bookings);
  const isOwner = profile?.role === "owner" || profile?.role === "both";
  const firstName = profile?.name?.split(" ")[0] ?? "Rajesh";

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mono-label text-primary">
            {isOwner ? "Farmer & owner dashboard" : "Farmer dashboard"}
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Good evening, {firstName} 👋</h1>
          <p className="mt-2 text-muted-foreground">
            {profile?.crop ?? "Cotton"} · {profile?.farmSize ?? 45} acres ·{" "}
            {profile?.location?.label ?? "Nandyal Block"}
            {profile?.farmName ? ` · ${profile.farmName}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="secondary" className="rounded-full">
            <Link to="/marketplace">List a resource</Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link to="/map">View resource map</Link>
          </Button>
        </div>
      </div>

      {/* Farm status */}
      <div className="mt-8 grid gap-4 lg:grid-cols-4">
        <div className="surface p-6">
          <p className="mono-label text-primary">Your crop</p>
          <p className="mt-3 flex items-center gap-2 font-display text-2xl font-bold">
            <Sprout className="size-6 text-primary" /> Cotton
          </p>
          <p className="mt-1 text-sm text-muted-foreground">45 acres · flowering stage</p>
        </div>
        <div className="surface p-6">
          <p className="mono-label text-primary">Soil moisture</p>
          <p className="mt-3 flex items-center gap-2 font-display text-3xl font-bold">
            <Droplets className="size-6 text-water" /> 42%
          </p>
          <p className="mt-1 flex items-center gap-1 text-sm text-primary">
            <ArrowUpRight className="size-4" /> 6% today
          </p>
        </div>
        <div className="surface p-6">
          <p className="mono-label text-primary">Weather</p>
          <p className="mt-3 flex items-center gap-2 font-display text-3xl font-bold">
            <CloudRain className="size-6 text-water" /> 29°C
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Rain probability 70%</p>
        </div>
        <div className="surface p-6">
          <p className="mono-label text-primary">Trust score</p>
          <p className="mt-3 font-display text-3xl font-bold">4.8</p>
          <Progress value={96} className="mt-3 h-2" />
          <p className="mt-2 text-xs text-muted-foreground">38 completed transactions</p>
        </div>
      </div>

      {/* Active rental / owner equipment tracking */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="surface p-6">
          <p className="mono-label text-primary">Active rental</p>
          {rental ? (
            <>
              <div className="mt-3 flex items-start gap-3">
                <span className="text-3xl">{rental.emoji}</span>
                <div className="flex-1">
                  <p className="font-display text-lg font-bold">{rental.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Owner: {rental.owner} ⭐ 4.9 · Booking{" "}
                    <span className="font-mono">{rental.id}</span>
                  </p>
                </div>
                <Badge className="rounded-full bg-sun text-forest">
                  {rental.stage === 2 ? "🟢 " : ""}
                  {bookingStages[rental.stage]}
                </Badge>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-secondary/60 p-4">
                  <p className="mono-label text-primary">Distance</p>
                  <p className="mt-1 flex items-center gap-1 font-display text-xl font-bold">
                    <MapPin className="size-4 text-primary" />
                    {rental.distanceKm} km
                  </p>
                </div>
                <div className="rounded-2xl bg-secondary/60 p-4">
                  <p className="mono-label text-primary">ETA</p>
                  <p className="mt-1 font-display text-xl font-bold">
                    {rental.stage === 2 ? `${rental.etaMinutes} min` : "—"}
                  </p>
                </div>
                <div className="rounded-2xl bg-secondary/60 p-4">
                  <p className="mono-label text-primary">Rental</p>
                  <p className="mt-1 text-sm font-medium">
                    {rental.from} – {rental.to}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild className="rounded-full">
                  <Link to="/booking/$id" params={{ id: rental.id }}>
                    Track equipment
                  </Link>
                </Button>
                <Button
                  variant="secondary"
                  className="gap-2 rounded-full"
                  onClick={() =>
                    toast.success(`Connecting you to ${rental.owner}…`, {
                      description: "Masked demo call — the owner's number is never shown.",
                    })
                  }
                >
                  <Phone className="size-4" /> Contact owner
                </Button>
              </div>
            </>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-border p-8 text-center">
              <p className="text-3xl">🚜</p>
              <p className="mt-2 font-medium">No active rentals</p>
              <p className="mt-1 text-sm text-muted-foreground">
                You don't have any equipment on the way right now.
              </p>
              <Button asChild className="mt-4 rounded-full">
                <Link to="/equipment">Explore equipment</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="surface p-6">
          <p className="mono-label text-primary">
            {isOwner ? "My equipment" : "Your shed, earning"}
          </p>
          {isOwner ? (
            <>
              <div className="mt-3 flex items-start gap-3">
                <span className="text-3xl">🚜</span>
                <div className="flex-1">
                  <p className="font-display text-lg font-bold">Mahindra 575 DI Tractor</p>
                  <p className="text-sm text-muted-foreground">
                    Current rental: Anitha Reddy · Anitha's Farm
                  </p>
                </div>
                <Badge className="rounded-full bg-sun text-forest">🟢 Rented</Badge>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-secondary/60 p-4">
                  <p className="mono-label text-primary">Destination</p>
                  <p className="mt-1 text-sm font-medium">3.2 km away</p>
                </div>
                <div className="rounded-2xl bg-secondary/60 p-4">
                  <p className="mono-label text-primary">ETA</p>
                  <p className="mt-1 font-display text-xl font-bold">18 min</p>
                </div>
                <div className="rounded-2xl bg-secondary/60 p-4">
                  <p className="mono-label text-primary">Earnings this month</p>
                  <p className="mt-1 font-display text-xl font-bold">₹24,600</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Condition: Excellent · last inspection Sep 25, 2026 · maintenance due in 32 hours
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild className="rounded-full">
                  <Link to="/booking/$id" params={{ id: rental?.id ?? "AGX-20481" }}>
                    Track
                  </Link>
                </Button>
                <Button
                  variant="secondary"
                  className="gap-2 rounded-full"
                  onClick={() =>
                    toast.success("Connecting you to Anitha Reddy…", {
                      description: "Masked demo call — numbers stay private.",
                    })
                  }
                >
                  <Phone className="size-4" /> Contact farmer
                </Button>
              </div>
            </>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-border p-8 text-center">
              <p className="text-3xl">💰</p>
              <p className="mt-2 font-medium">Not listing anything yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Switch on the owner role to rent out your idle machinery and earn from it.
              </p>
              <Button asChild className="mt-4 rounded-full">
                <Link to="/settings">Become a resource owner</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* AI recommendation */}
        <div className="surface-dark p-6">
          <div className="flex items-center gap-2">
            <Brain className="size-4 text-lime" />
            <p className="mono-label text-lime">AI recommendation</p>
          </div>
          <h2 className="mt-3 text-xl font-semibold">
            Rain is expected tomorrow — consider delaying irrigation
          </h2>
          <p className="mt-2 text-sm text-forest-foreground/75">
            Pooled data from {agriPulse.farmsContributing} nearby farms puts rainfall probability at
            72% within 18 hours. Holding back one cycle keeps soil moisture above 34% and saves an
            estimated 1,240 L/acre.
          </p>
          <div className="mt-5 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={agriPulse.moistureSeries}>
                <defs>
                  <linearGradient id="dashMoist" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-lime)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--color-lime)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="var(--color-lime)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-forest)",
                    border: "1px solid var(--color-lime)",
                    borderRadius: 12,
                    color: "var(--color-forest-foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="moisture"
                  stroke="var(--color-lime)"
                  strokeWidth={3}
                  fill="url(#dashMoist)"
                  name="Soil moisture %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <Button asChild className="mt-4 rounded-full">
            <Link to="/ai-insights">View recommendation</Link>
          </Button>
        </div>

        {/* Nearby resources */}
        <div className="surface p-6">
          <p className="mono-label text-primary">Nearby resources</p>
          <div className="mt-4 grid gap-2">
            {mapPoints.slice(0, 6).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm hover:bg-secondary"
              >
                <span className="flex items-center gap-2">
                  <span>{p.emoji}</span>
                  {p.label}
                </span>
                <span className="font-mono text-xs text-muted-foreground">{p.distanceKm} km</span>
              </div>
            ))}
          </div>
          <Button asChild variant="secondary" className="mt-4 w-full rounded-full">
            <Link to="/map">Open resource map</Link>
          </Button>
        </div>
      </div>

      {/* Listings / rentals */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="surface p-6">
          <p className="mono-label text-primary">My listings</p>
          <div className="mt-4 grid gap-3">
            {myListings.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-4 rounded-2xl border border-border p-4"
              >
                <span className="text-2xl">{r.emoji}</span>
                <div className="flex-1">
                  <p className="font-medium">{r.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.price === 0 ? "Exchange" : `₹${r.price}/${r.unit}`} · {r.jobs} bookings
                  </p>
                </div>
                <Badge variant="secondary" className="rounded-full">
                  Live
                </Badge>
              </div>
            ))}
            <div className="flex items-center gap-4 rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              + Add the equipment sitting idle in your shed
            </div>
          </div>
        </div>

        <div className="surface p-6">
          <p className="mono-label text-primary">Active rentals & transactions</p>
          <div className="mt-4 grid gap-3">
            {ledger.slice(0, 3).map((t) => (
              <div key={t.id} className="rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-muted-foreground">#{t.id}</span>
                  <Badge
                    className={
                      t.status === "In escrow"
                        ? "rounded-full bg-sun text-forest"
                        : "rounded-full bg-primary text-primary-foreground"
                    }
                  >
                    {t.status}
                  </Badge>
                </div>
                <p className="mt-2 font-medium">{t.item}</p>
                <p className="text-xs text-muted-foreground">
                  {t.from} → {t.to} ·{" "}
                  {t.amount === 0 ? "barter" : `₹${t.amount.toLocaleString("en-IN")}`}
                </p>
              </div>
            ))}
          </div>
          <Button asChild variant="secondary" className="mt-4 w-full rounded-full">
            <Link to="/ledger">Open full ledger</Link>
          </Button>
        </div>
      </div>

      {/* Shared data + impact */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="surface p-6">
          <p className="mono-label text-primary">Shared data</p>
          <div className="mt-4 grid gap-2">
            {dataStreams.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 text-sm">
                <span>{s.name}</span>
                <Badge
                  variant="secondary"
                  className="rounded-full font-mono text-[11px] uppercase"
                >
                  {s.visibility}
                </Badge>
              </div>
            ))}
          </div>
          <Button asChild variant="secondary" className="mt-4 w-full rounded-full">
            <Link to="/data-exchange">Manage permissions</Link>
          </Button>
        </div>

        <div className="surface p-6">
          <p className="mono-label text-primary">Environmental & economic impact</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {impact.map((i) => (
              <div key={i.label} className="rounded-2xl bg-secondary/60 p-5">
                <p className="text-xl">{i.icon}</p>
                <p className="mt-2 font-display text-2xl font-bold">{i.value}</p>
                <p className="text-sm text-muted-foreground">{i.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
