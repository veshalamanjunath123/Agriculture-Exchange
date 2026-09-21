import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, Sparkles, MapPin, Star, CalendarDays, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { smartMatch, type MatchResult } from "@/lib/agri-data";

const crops = ["Cotton", "Paddy", "Maize", "Chilli", "Vegetables"];

export function SmartMatch({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const { createBooking } = useSession();
  const [text, setText] = useState("I need a tractor for 2 days within 20 km");
  const [radius, setRadius] = useState(20);
  const [days, setDays] = useState(2);
  const [crop, setCrop] = useState("Cotton");
  const [budget, setBudget] = useState(6000);
  const [submitted, setSubmitted] = useState(true);

  const results: MatchResult[] = useMemo(
    () => (submitted ? smartMatch({ text, radiusKm: radius, days, crop, maxPrice: budget }) : []),
    [submitted, text, radius, days, crop, budget],
  );

  return (
    <div className={compact ? "" : "mx-auto w-full max-w-7xl px-4 sm:px-6"}>
      <div className="surface overflow-hidden">
        <div className="bg-forest px-6 py-5 text-forest-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-lime" />
            <p className="mono-label text-lime">Smart Resource Match</p>
          </div>
          <p className="mt-2 text-sm text-forest-foreground/75">
            Describe what you need in plain language. The engine scores distance, availability,
            price, ratings and crop compatibility.
          </p>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_1.4fr]">
          <form
            className="grid gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="need">What do you need?</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="need"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="h-12 rounded-xl pl-9"
                  placeholder="Find irrigation equipment nearby"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex justify-between text-sm">
                <Label>Search radius</Label>
                <span className="font-mono text-muted-foreground">{radius} km</span>
              </div>
              <Slider
                value={[radius]}
                min={2}
                max={40}
                step={1}
                onValueChange={(v) => setRadius(v[0] ?? radius)}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex justify-between text-sm">
                <Label>Days needed</Label>
                <span className="font-mono text-muted-foreground">{days} day(s)</span>
              </div>
              <Slider value={[days]} min={1} max={10} step={1} onValueChange={(v) => setDays(v[0] ?? days)} />
            </div>

            <div className="grid gap-2">
              <div className="flex justify-between text-sm">
                <Label>Budget ceiling</Label>
                <span className="font-mono text-muted-foreground">
                  ₹{budget.toLocaleString("en-IN")}
                </span>
              </div>
              <Slider
                value={[budget]}
                min={500}
                max={20000}
                step={100}
                onValueChange={(v) => setBudget(v[0] ?? budget)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Crop / operation</Label>
              <div className="flex flex-wrap gap-2">
                {crops.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCrop(c)}
                    className={
                      c === crop
                        ? "rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
                        : "rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-secondary"
                    }
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="h-12 rounded-full">
              Run Smart Match
            </Button>
          </form>

          <div className="grid gap-3">
            {results.length === 0 ? (
              <div className="flex h-full min-h-40 items-center justify-center rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No match above the confidence threshold. Widen your radius or budget.
              </div>
            ) : (
              results.map((match, i) => (
                <div
                  key={match.resource.id}
                  className={
                    i === 0
                      ? "rounded-2xl border-2 border-primary bg-secondary/60 p-5"
                      : "rounded-2xl border border-border p-5"
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{match.resource.emoji}</span>
                      <div>
                        <p className="font-semibold leading-tight">{match.resource.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Owner: {match.resource.owner}
                        </p>
                      </div>
                    </div>
                    <Badge className="rounded-full bg-lime text-lime-foreground">
                      {match.score}% match
                    </Badge>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-4 text-primary" /> {match.resource.distanceKm} km
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="size-4 text-primary" />{" "}
                      {match.resource.availableFrom}–{match.resource.availableTo}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Star className="size-4 text-sun" /> {match.resource.rating}/5
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold text-foreground">
                      {match.resource.price === 0
                        ? "Exchange"
                        : `₹${match.resource.price.toLocaleString("en-IN")}/${match.resource.unit}`}
                    </span>
                    {match.resource.verified ? (
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="size-4 text-primary" /> Verified
                      </span>
                    ) : null}
                  </div>

                  <ul className="mt-4 grid gap-1.5 text-sm text-muted-foreground">
                    {match.reasons.map((r) => (
                      <li key={r} className="flex gap-2">
                        <span className="text-primary">•</span>
                        {r}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="mt-4 rounded-full"
                    size="sm"
                    variant={i === 0 ? "default" : "secondary"}
                    onClick={() => {
                      const booking = createBooking(match.resource, days);
                      toast.success(`Request sent to ${match.resource.owner}`, {
                        description: `${match.resource.title} · booking ${booking.id} secured in escrow.`,
                      });
                      navigate({ to: "/booking/$id", params: { id: booking.id } });
                    }}
                  >
                    Request resource
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
