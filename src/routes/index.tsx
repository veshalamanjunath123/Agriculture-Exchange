import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Tractor,
  Sprout,
  Droplets,
  Sun,
  BarChart3,
  Brain,
  MapPin,
  Star,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SmartMatch } from "@/components/smart-match";
import heroPoster from "@/assets/hero-farm-poster.jpg";
import heroVideo from "@/assets/hero-farm.mp4.asset.json";
import { impactStats, resources, agriPulse } from "@/lib/agri-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriXchange — Share resources. Share knowledge. Grow smarter." },
      {
        name: "description",
        content:
          "AgriXchange connects farmers to machinery, inputs, water, energy and agricultural data through a trusted peer-to-peer exchange with AI-powered matching.",
      },
      { property: "og:title", content: "AgriXchange — shared agriculture, smarter farms" },
      {
        property: "og:description",
        content:
          "Rent a tractor 8 km away, trade surplus seed, pool sensor data and get regional AI insights from AgriPulse.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const exchangeCards = [
  {
    icon: Tractor,
    title: "Machinery",
    body: "Rent tractors, harvesters, drones and specialised equipment by the day.",
  },
  {
    icon: Sprout,
    title: "Seeds & Inputs",
    body: "Trade surplus seed, fertiliser and bio-inputs with farms next door.",
  },
  {
    icon: Droplets,
    title: "Water",
    body: "Coordinate canal turns, pump sets and irrigation capacity in your block.",
  },
  { icon: Sun, title: "Energy", body: "Share excess solar generation instead of wasting it." },
  {
    icon: BarChart3,
    title: "Data",
    body: "Exchange anonymised soil, weather and pest intelligence on your terms.",
  },
  {
    icon: Brain,
    title: "Knowledge",
    body: "Practices, advisories and AI insights from farmers who grow what you grow.",
  },
];

const steps = [
  {
    n: "01",
    title: "List what sits idle",
    body: "Add your tractor, pump set, storage space or surplus inputs in under a minute.",
  },
  {
    n: "02",
    title: "Get smart-matched",
    body: "Our engine scores distance, availability, price, ratings and crop fit for every request.",
  },
  {
    n: "03",
    title: "Book under a smart contract",
    body: "Payment held in escrow, released when the resource returns in agreed condition.",
  },
  {
    n: "04",
    title: "Pool data, gain insight",
    body: "Shared sensor readings power AgriPulse regional intelligence for everyone nearby.",
  },
];

const testimonials = [
  {
    quote:
      "I needed a rotavator for three days. Buying one would have cost ₹1.4 lakh. I rented it from a farm 6 km away for ₹4,800.",
    name: "Rajesh Gowda",
    farm: "45 acres · Cotton · Nandyal",
  },
  {
    quote:
      "AgriPulse told me rain was 18 hours away. I delayed irrigation and saved 1,240 litres per acre.",
    name: "Anitha Reddy",
    farm: "25 acres · Cotton · Banaganapalle",
  },
  {
    quote:
      "My drone was idle 300 days a year. Now it earns ₹1,200 a day and my neighbours spray on time.",
    name: "Bhaskar Rao",
    farm: "18 acres · Paddy · Dhone",
  },
];

/** Play the cinematic loop only where bandwidth and screen size make it worthwhile. */
function useHeroVideo() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    };
    const conn = nav.connection;
    const slow = conn?.saveData === true || /2g|slow-2g|3g/.test(conn?.effectiveType ?? "");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 640px)").matches;
    setEnabled(!slow && !reduced && !small);
  }, []);
  return enabled;
}

function Home() {
  const { t } = useI18n();
  const preview = resources.slice(0, 4);
  const videoOn = useHeroVideo();

  return (
    <>
      {/* ---------- Cinematic video hero ---------- */}
      <section className="relative isolate overflow-hidden text-white">
        <img
          src={heroPoster}
          alt="Aerial view of farmland at golden hour"
          width={1920}
          height={1080}
          className="absolute inset-0 -z-20 size-full object-cover"
        />
        {videoOn ? (
          <video
            className="absolute inset-0 -z-20 size-full object-cover"
            src={heroVideo.url}
            poster={heroPoster}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
          />
        ) : null}
        {/* Transparent cinematic wash — keeps text readable without a flat colour block */}
        <div className="absolute inset-0 -z-10 bg-black/25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest/80 via-forest/25 to-navy/40" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-28 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-36">
          <div>
            <span className="mono-label animate-fade-up inline-flex items-center gap-2 rounded-full border border-lime/50 bg-black/20 px-3 py-1.5 text-lime backdrop-blur">
              {t("Share resources. Share knowledge. Grow smarter.")}
            </span>
            <h1
              className="animate-fade-up mt-6 text-4xl font-bold leading-[1.05] drop-shadow-[0_2px_20px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-6xl"
              style={{ animationDelay: "80ms" }}
            >
              {t("Agriculture works better when farmers work together.")}
            </h1>
            <p
              className="animate-fade-up mt-6 max-w-xl text-lg text-white/85"
              style={{ animationDelay: "160ms" }}
            >
              {t(
                "A smart resource exchange that lets farmers share machinery, trade inputs, exchange agricultural data and use AI-powered insights to make better decisions.",
              )}
            </p>
            <div
              className="animate-fade-up mt-8 flex flex-wrap gap-3"
              style={{ animationDelay: "240ms" }}
            >
              <Button asChild size="lg" className="rounded-full">
                <Link to="/marketplace">
                  {t("Explore Marketplace")} <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20"
              >
                <Link to="/auth">{t("Join the Exchange")}</Link>
              </Button>
            </div>
          </div>

          {/* Floating cards over the video */}
          <div className="grid gap-4 self-center">
            <div
              className="animate-float-in rounded-3xl border border-white/20 bg-black/35 p-6 backdrop-blur-xl"
              style={{ animationDelay: "200ms" }}
            >
              <p className="mono-label text-lime">AgriPulse · {agriPulse.region}</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {agriPulse.metrics.slice(0, 3).map((m) => (
                  <div
                    key={m.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center"
                  >
                    <p className="text-[11px] text-white/65">{t(m.label)}</p>
                    <p className="mt-1 font-display text-xl font-bold text-lime">{m.value}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-white/85">
                💧 {t("Irrigation may be delayed by 12 hours.")}
              </p>
              <p className="mono-label mt-2 text-lime">
                🤖 {t("AI recommendation")} · {agriPulse.confidence}%
              </p>
            </div>

            <div
              className="animate-float-in rounded-3xl border border-lime/40 bg-lime/15 p-6 backdrop-blur-xl"
              style={{ animationDelay: "380ms" }}
            >
              <p className="mono-label text-lime">🚜 {t("Smart Match Found")}</p>
              <p className="mt-2 font-display text-lg font-bold">Mahindra 575 DI</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/85">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-lime" />8.4 {t("km away")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="size-4 text-sun" />
                  4.8
                </span>
                <span className="flex items-center gap-1.5">
                  <BadgeCheck className="size-4 text-lime" />
                  {t("Verified data")}
                </span>
              </div>
              <p className="mt-3 font-display text-xl font-bold">
                ₹1,800
                <span className="text-sm font-normal text-white/70">/{t("per day")}</span>
              </p>
              <Button asChild size="sm" className="mt-4 rounded-full">
                <Link to="/resource/$id" params={{ id: "AGX-R-101" }}>
                  {t("View details")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Smart match */}
      <section id="find" className="bg-secondary/40 py-20">
        <div className="mx-auto mb-8 w-full max-w-7xl px-4 sm:px-6">
          <p className="mono-label text-primary">{t("Find resources near you")}</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            {t("Tell us what you need. We find who has it.")}
          </h2>
        </div>
        <SmartMatch />
      </section>

      {/* Problem + impact */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="mono-label text-primary">{t("The problem")}</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              {t("Farming shouldn't require every farm to own everything.")}
            </h2>
          </div>
          <div className="grid gap-4 text-lg text-muted-foreground">
            <p>
              {t(
                "A farmer may need a ₹10 lakh+ machine for only a few days a year. Another farm nearby may own that machine and leave it unused for most of the season.",
              )}
            </p>
            <p className="font-semibold text-foreground">{t("AgriXchange connects them.")}</p>
          </div>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {impactStats.map((s) => (
            <div key={s.label} className="surface p-6">
              <p className="font-display text-3xl font-bold text-gradient-agri">{s.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t(s.label)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What can you exchange */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
        <p className="mono-label text-primary">{t("What can you exchange?")}</p>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{t("Six kinds of shared value")}</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exchangeCards.map((c) => (
            <div key={c.title} className="surface p-6">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                <c.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{t(c.title)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(c.body)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live marketplace preview */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mono-label text-primary">{t("Live marketplace")}</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              {t("Available near Nandyal today")}
            </h2>
          </div>
          <Button asChild variant="secondary" className="rounded-full">
            <Link to="/marketplace">{t("Browse all listings")}</Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {preview.map((r) => (
            <div key={r.id} className="surface p-5">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{r.emoji}</span>
                <span className="mono-label text-primary">
                  {r.mode.map((m) => t(m)).join(" / ")}
                </span>
              </div>
              <h3 className="mt-4 font-semibold leading-snug">{r.title}</h3>
              <p className="mt-2 font-display text-xl font-bold">
                {r.price === 0 ? t("Exchange") : `₹${r.price.toLocaleString("en-IN")}`}
                {r.price === 0 ? null : (
                  <span className="text-sm font-normal text-muted-foreground">/{r.unit}</span>
                )}
              </p>
              <div className="mt-3 grid gap-1.5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-primary" />
                  {r.distanceKm} {t("km away")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="size-4 text-sun" />
                  {r.rating} · {t("Available")} {r.availableFrom}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-forest py-20 text-forest-foreground">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <p className="mono-label text-lime">{t("How it works")}</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            {t("From idle asset to booked resource in four steps")}
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="border-t border-forest-foreground/20 pt-5">
                <p className="font-display text-3xl font-bold text-lime">{s.n}</p>
                <h3 className="mt-3 text-lg font-semibold">{t(s.title)}</h3>
                <p className="mt-2 text-sm text-forest-foreground/70">{t(s.body)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resource map preview */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
        <div className="surface grid gap-8 p-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="mono-label text-primary">{t("Resource Map")}</p>
            <h2 className="mt-3 text-3xl font-bold">
              {t("See every shared resource around your farm")}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {t(
                "Machinery, storage, water and energy plotted by distance, with approximate locations until a booking is confirmed.",
              )}
            </p>
            <Button asChild className="mt-6 rounded-full">
              <Link to="/map">{t("See the resource map")}</Link>
            </Button>
          </div>
          <div className="bg-field-grid relative h-56 overflow-hidden rounded-3xl border border-border bg-secondary/50">
            {[
              { x: "18%", y: "30%", e: "🚜" },
              { x: "44%", y: "58%", e: "🛩️" },
              { x: "68%", y: "26%", e: "💧" },
              { x: "80%", y: "66%", e: "🏭" },
              { x: "32%", y: "78%", e: "☀️" },
            ].map((p) => (
              <span
                key={p.e}
                className="absolute flex size-10 items-center justify-center rounded-full border border-border bg-card shadow-soft"
                style={{ left: p.x, top: p.y }}
              >
                {p.e}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <p className="mono-label text-primary">{t("Farmer stories")}</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{t("What the network changed")}</h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {testimonials.map((x) => (
              <figure key={x.name} className="surface p-6">
                <blockquote className="text-base leading-relaxed">“{x.quote}”</blockquote>
                <figcaption className="mt-5 border-t border-border pt-4">
                  <p className="font-semibold">{x.name}</p>
                  <p className="text-sm text-muted-foreground">{x.farm}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="mono-label text-primary">{t("Sustainability")}</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              {t("Sharing is the cheapest climate technology we have.")}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {t(
                "Every shared machine removes a manufacturing footprint. Every AI-timed irrigation saves groundwater. Every pooled dataset makes the next farmer's decision better than the last.",
              )}
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" />
              {t("Farmers keep full ownership and control of their data.")}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { v: "2.1 M L", l: "Irrigation water saved this season" },
              { v: "640 t", l: "CO₂e avoided through shared machinery" },
              { v: "3,180", l: "Duplicate machine purchases avoided" },
              { v: "27%", l: "Less fertiliser through targeted advice" },
            ].map((x) => (
              <div key={x.l} className="surface-dark p-6">
                <p className="font-display text-2xl font-bold text-lime">{x.v}</p>
                <p className="mt-2 text-sm text-forest-foreground/70">{t(x.l)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        <div className="surface-dark relative overflow-hidden px-8 py-16 text-center">
          <div className="bg-field-grid absolute inset-0 opacity-30" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold sm:text-4xl">
              {t("Join the Exchange. Put your idle assets to work.")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-forest-foreground/75">
              {t(
                "Free to list. Verified farmers only. Payments protected by escrow until the resource comes back.",
              )}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/auth">{t("Create my farm profile")}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-forest-foreground/30 bg-transparent text-forest-foreground hover:bg-forest-foreground/10"
              >
                <Link to="/map">{t("See the resource map")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
