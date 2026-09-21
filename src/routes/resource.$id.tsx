import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, MapPin, ShieldCheck, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { resources } from "@/lib/agri-data";
import { useI18n } from "@/lib/i18n";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/resource/$id")({
  loader: ({ params }) => {
    const resource = resources.find((r) => r.id === params.id);
    if (!resource) throw notFound();
    return { resource };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Listing unavailable — AgriXchange" }, { name: "robots", content: "noindex" }] };
    }
    const r = loaderData.resource;
    const description = `${r.title} from ${r.owner}, ${r.distanceKm} km away. ${r.price === 0 ? "Exchange listing" : `₹${r.price}/${r.unit}`} · rated ${r.rating}.`;
    return {
      meta: [
        { title: `${r.title} — AgriXchange` },
        { name: "description", content: description },
        { property: "og:title", content: `${r.title} on AgriXchange` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ResourceDetails,
});

const SPECS: Record<string, { label: string; value: string }[]> = {
  "AGX-R-101": [
    { label: "Horsepower", value: "50 HP" },
    { label: "Fuel type", value: "Diesel" },
    { label: "Year", value: "2023" },
    { label: "Implements", value: "Cultivator, rotavator" },
  ],
  "AGX-R-103": [
    { label: "Tank", value: "10 L" },
    { label: "Coverage", value: "6 acres/hour" },
    { label: "Battery sets", value: "3" },
    { label: "Pilot", value: "DGCA certified" },
  ],
};

const REVIEWS = [
  {
    author: "Anitha Reddy",
    rating: 5,
    text: "Arrived on time, clean and fuelled. Owner explained the rotavator settings for black soil.",
    time: "3 days ago",
  },
  {
    author: "Rajesh Gowda",
    rating: 4,
    text: "Good machine. Slight delay at pickup but the work got done in one day.",
    time: "2 weeks ago",
  },
  {
    author: "Krishna Farms FPO",
    rating: 5,
    text: "We booked it for a group of four farms. Very well maintained.",
    time: "1 month ago",
  },
];

function ResourceDetails() {
  const { resource } = Route.useLoaderData();
  const { t } = useI18n();
  const navigate = useNavigate();
  const { createBooking } = useSession();
  const [days, setDays] = useState(2);

  const specs = SPECS[resource.id] ?? [
    { label: "Category", value: resource.category },
    { label: "Condition", value: resource.condition },
    { label: "Completed jobs", value: String(resource.jobs) },
    { label: "On-time rate", value: `${resource.onTimeReturnRate}%` },
  ];

  const deposit = resource.category === "Machinery" ? 5000 : 1000;
  const total = resource.price * (resource.unit === "day" ? days : 1);

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="grid gap-6">
        <div className="surface p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex size-16 items-center justify-center rounded-3xl bg-secondary text-3xl">
              {resource.emoji}
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold sm:text-3xl">{resource.title}</h1>
              <p className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="size-4 text-sun" /> {resource.rating}
                </span>
                <span>{resource.jobs} completed rentals</span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-4 text-primary" /> {resource.distanceKm} km away
                </span>
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {resource.mode.map((m) => (
                  <Badge key={m} variant="secondary" className="rounded-full">
                    {m}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-secondary/60 p-4">
              <p className="mono-label text-primary">Price</p>
              <p className="mt-1 font-display text-2xl font-bold">
                {resource.price === 0 ? "Exchange" : `₹${resource.price.toLocaleString("en-IN")}`}
              </p>
              {resource.price === 0 ? null : (
                <p className="text-xs text-muted-foreground">per {resource.unit}</p>
              )}
            </div>
            <div className="rounded-2xl bg-secondary/60 p-4">
              <p className="mono-label text-primary">Available</p>
              <p className="mt-1 flex items-center gap-1 font-medium">
                <CalendarDays className="size-4 text-primary" />
                {resource.availableFrom} – {resource.availableTo}
              </p>
            </div>
            <div className="rounded-2xl bg-secondary/60 p-4">
              <p className="mono-label text-primary">Owner</p>
              <p className="mt-1 font-medium">{resource.owner}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                {resource.verified ? (
                  <>
                    <ShieldCheck className="size-3.5 text-primary" /> Verified owner
                  </>
                ) : (
                  "Verification pending"
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="surface p-6">
          <p className="mono-label text-primary">Equipment information</p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {specs.map((s) => (
              <div key={s.label} className="flex justify-between gap-3 border-b border-border pb-2 text-sm">
                <dt className="text-muted-foreground">{s.label}</dt>
                <dd className="font-medium">{s.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mono-label mt-6 text-primary">Suitable for</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {resource.crops.map((c) => (
              <Badge key={c} variant="secondary" className="rounded-full">
                ✓ {c}
              </Badge>
            ))}
          </div>
        </div>

        <div className="surface p-6">
          <p className="mono-label text-primary">Location</p>
          <div className="bg-field-grid relative mt-4 h-56 overflow-hidden rounded-2xl border border-border bg-secondary/40">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="block text-3xl">{resource.emoji}</span>
              <span className="mono-label text-primary">{resource.village}</span>
            </span>
            <span className="absolute bottom-3 left-3 rounded-full bg-card px-3 py-1.5 text-xs text-muted-foreground">
              Approximate area · {resource.distanceKm} km from your farm
            </span>
          </div>
          <Button asChild variant="secondary" className="mt-4 rounded-full">
            <Link to="/map">View on map</Link>
          </Button>
        </div>

        <div className="surface p-6">
          <p className="mono-label text-primary">Recent reviews</p>
          <div className="mt-4 grid gap-4">
            {REVIEWS.map((r) => (
              <div key={r.author} className="rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{r.author}</p>
                  <span className="text-sm text-sun">{"★".repeat(r.rating)}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">{r.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="h-fit lg:sticky lg:top-24">
        <div className="surface p-6">
          <p className="mono-label text-primary">Rental information</p>
          <div className="mt-4 grid gap-2">
            <Label className="text-sm text-muted-foreground">Rental length</Label>
            <div className="flex items-center gap-3">
              <Slider
                value={[days]}
                min={1}
                max={10}
                step={1}
                onValueChange={(v) => setDays(v[0] ?? days)}
              />
              <span className="w-16 font-mono text-sm text-muted-foreground">{days} day</span>
            </div>
          </div>
          <dl className="mt-5 grid gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                {resource.price === 0 ? "Exchange" : `Rate per ${resource.unit}`}
              </dt>
              <dd>{resource.price === 0 ? "Barter" : `₹${resource.price.toLocaleString("en-IN")}`}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Security deposit</dt>
              <dd>₹{deposit.toLocaleString("en-IN")}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-semibold">
              <dt>Total</dt>
              <dd>{total === 0 ? "Exchange" : `₹${total.toLocaleString("en-IN")}`}</dd>
            </div>
          </dl>
          <Button
            className="mt-5 w-full rounded-full"
            onClick={() => {
              const booking = createBooking(resource, days);
              toast.success("Booking confirmed 🎉", {
                description: `${resource.title} · booking ${booking.id}`,
              });
              navigate({ to: "/booking/$id", params: { id: booking.id } });
            }}
          >
            {t("Request Equipment")}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Payment is held in a rental contract until the equipment is returned and both sides
            confirm the condition.
          </p>
        </div>
      </aside>
    </section>
  );
}
