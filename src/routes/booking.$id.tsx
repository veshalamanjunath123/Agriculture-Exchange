import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, Navigation, Phone, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { bookingStages, useSession, type Booking } from "@/lib/session";

export const Route = createFileRoute("/booking/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Booking ${params.id} — AgriXchange` },
      {
        name: "description",
        content:
          "Live equipment tracking for your AgriXchange rental: status timeline, route to your farm, estimated arrival, return report and rating.",
      },
      { property: "og:title", content: "Track your AgriXchange rental" },
      {
        property: "og:description",
        content: "Status, route, ETA, return report and rating in one place.",
      },
    ],
  }),
  component: BookingPage,
});

const CONDITIONS = ["Excellent", "Good", "Fair", "Needs Maintenance"];

function minutesAgo(ts: number) {
  const mins = Math.max(0, Math.round((Date.now() - ts) / 60000));
  return mins === 0 ? "just now" : `${mins} minute${mins === 1 ? "" : "s"} ago`;
}

function BookingPage() {
  const { id } = Route.useParams();
  const { t } = useI18n();
  const { bookings, advanceBooking, updateBooking, addNotification, ready } = useSession();
  const booking = bookings.find((b) => b.id === id);

  if (!ready) {
    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <div className="surface h-64 animate-pulse p-6" />
      </section>
    );
  }

  if (!booking) {
    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold">Booking not found</h1>
        <p className="mt-2 text-muted-foreground">
          This booking is not on this device. Open the marketplace to book a resource.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/marketplace">Go to marketplace</Link>
        </Button>
      </section>
    );
  }

  return <BookingView booking={booking} advance={advanceBooking} update={updateBooking} notify={addNotification} t={t} />;
}

function BookingView({
  booking,
  advance,
  update,
  notify,
  t,
}: {
  booking: Booking;
  advance: (id: string) => void;
  update: (id: string, patch: Partial<Booking>) => void;
  notify: (n: { icon: string; title: string; body: string }) => void;
  t: (k: string) => string;
}) {
  const stage = booking.stage;
  const stageName = bookingStages[stage] ?? "Completed";
  const enRoute = stage === 2;

  const [progress, setProgress] = useState(enRoute ? 30 : stage > 2 ? 100 : 0);
  const [condition, setCondition] = useState("Excellent");
  const [comments, setComments] = useState("");
  const [stars, setStars] = useState({ overall: 5, condition: 5, communication: 5, timeliness: 5 });
  const [rentAgain, setRentAgain] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [ownerStars, setOwnerStars] = useState({
    overall: 5,
    condition: 5,
    communication: 5,
    timeliness: 5,
  });
  const [ownerFeedback, setOwnerFeedback] = useState("");
  const [damageIssue, setDamageIssue] = useState("");

  // Simulated GPS movement while the equipment is on the way.
  useEffect(() => {
    if (!enRoute) {
      setProgress(stage > 2 ? 100 : 0);
      return;
    }
    const id = window.setInterval(() => {
      setProgress((p) => Math.min(96, p + 2));
    }, 1200);
    return () => window.clearInterval(id);
  }, [enRoute, stage]);

  const etaMinutes = enRoute ? Math.max(1, Math.round(booking.etaMinutes * (1 - progress / 100))) : 0;
  const liveDistance = enRoute
    ? Math.max(0.2, booking.distanceKm * (1 - progress / 100)).toFixed(1)
    : stage > 2
      ? "0.0"
      : booking.distanceKm.toFixed(1);

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="grid gap-6">
        {stage === 0 ? (
          <div className="surface-dark p-6 sm:p-8">
            <p className="mono-label text-lime">Booking confirmed 🎉</p>
            <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{booking.title}</h1>
            <p className="mt-2 text-sm text-forest-foreground/75">
              Rental {booking.from} – {booking.to} · ₹{booking.amount.toLocaleString("en-IN")} +
              ₹{booking.deposit.toLocaleString("en-IN")} security deposit
            </p>
            <p className="mt-1 text-sm text-forest-foreground/75">
              Owner {booking.owner} · 📍 {booking.distanceKm} km away · Booking{" "}
              <span className="font-mono">{booking.id}</span>
            </p>
          </div>
        ) : null}

        <div className="surface p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="mono-label text-primary">🚜 Equipment tracking</p>
              <h2 className="mt-2 font-display text-xl font-bold">{booking.title}</h2>
            </div>
            <Badge
              className={
                stage >= 7
                  ? "rounded-full bg-primary text-primary-foreground"
                  : "rounded-full bg-sun text-forest"
              }
            >
              {stage === 2 ? "🟢 " : ""}
              {stageName}
            </Badge>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-secondary/60 p-4">
              <p className="mono-label text-primary">Owner</p>
              <p className="mt-1 font-medium">{booking.owner}</p>
              <p className="text-xs text-muted-foreground">
                📍 {booking.ownerLocation.label} · {liveDistance} km away
              </p>
            </div>
            <div className="rounded-2xl bg-secondary/60 p-4">
              <p className="mono-label text-primary">Destination</p>
              <p className="mt-1 font-medium">{booking.farmLocation.label}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {booking.farmLocation.lat}, {booking.farmLocation.lng}
              </p>
            </div>
            <div className="rounded-2xl bg-secondary/60 p-4">
              <p className="mono-label text-primary">Estimated arrival</p>
              <p className="mt-1 font-display text-2xl font-bold">
                {enRoute ? `${etaMinutes} min` : stage > 2 ? "Arrived" : "Pending"}
              </p>
              <p className="text-xs text-muted-foreground">
                Last updated {minutesAgo(booking.updatedAt)}
              </p>
            </div>
          </div>

          {/* Route map with simulated movement */}
          <div className="bg-field-grid relative mt-5 h-52 overflow-hidden rounded-2xl border border-border bg-secondary/40">
            <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M 12 70 C 35 40, 65 80, 88 45"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="1.4"
                strokeDasharray="4 3"
              />
            </svg>
            <span className="absolute bottom-4 left-3 text-center text-xs text-muted-foreground">
              <span className="block text-2xl">🏠</span>Owner
            </span>
            <span className="absolute right-3 top-8 text-center text-xs text-muted-foreground">
              <span className="block text-2xl">📍</span>Your farm
            </span>
            <span
              className="absolute -translate-x-1/2 -translate-y-1/2 text-3xl transition-all duration-1000"
              style={{ left: `${12 + progress * 0.76}%`, top: `${70 - progress * 0.25}%` }}
            >
              {booking.emoji}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              className="rounded-full"
              onClick={() => toast.success("Live tracking refreshed", { description: `ETA ${etaMinutes || 0} minutes` })}
            >
              {t("Track Equipment")}
            </Button>
            <Button
              variant="secondary"
              className="gap-2 rounded-full"
              onClick={() => toast.success("Route opened", { description: `${booking.distanceKm} km via Nandyal road` })}
            >
              <Navigation className="size-4" /> {t("Get Directions")}
            </Button>
            <Button
              variant="secondary"
              className="gap-2 rounded-full"
              onClick={() => toast.success(`Calling ${booking.owner}…`, { description: "Demo call — no number dialled." })}
            >
              <Phone className="size-4" /> {t("Contact Owner")}
            </Button>
            {stage < bookingStages.length - 1 ? (
              <Button
                variant="ghost"
                className="gap-2 rounded-full"
                onClick={() => {
                  advance(booking.id);
                  const next = bookingStages[Math.min(bookingStages.length - 1, stage + 1)];
                  notify({ icon: "🚜", title: `Status: ${next}`, body: `${booking.title} · booking ${booking.id}` });
                  toast.success(`Status updated: ${next}`);
                }}
              >
                <RefreshCw className="size-4" /> Advance demo status
              </Button>
            ) : null}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Precise coordinates are visible to you and {booking.owner} only while this booking is
            active. Simulated GPS for the demo — ready for real IoT/GPS feeds.
          </p>
        </div>

        {/* Timeline */}
        <div className="surface p-6">
          <p className="mono-label text-primary">Rental timeline</p>
          <ol className="mt-4 grid gap-3">
            {bookingStages.map((s, i) => (
              <li key={s} className="flex items-center gap-3 text-sm">
                <span
                  className={
                    "flex size-6 items-center justify-center rounded-full text-xs " +
                    (i < stage
                      ? "bg-primary text-primary-foreground"
                      : i === stage
                        ? "bg-lime text-lime-foreground"
                        : "bg-secondary text-muted-foreground")
                  }
                >
                  {i < stage ? "✓" : i === stage ? "●" : "○"}
                </span>
                <span className={i <= stage ? "font-medium" : "text-muted-foreground"}>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <aside className="grid h-fit gap-6 lg:sticky lg:top-24">
        {/* Return flow */}
        {stage >= 4 && stage < 6 ? (
          <div className="surface p-6">
            <p className="mono-label text-primary">Rental completed</p>
            <h2 className="mt-2 text-lg font-semibold">{booking.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Was the equipment returned successfully?
            </p>
            {stage === 4 ? (
              <Button
                className="mt-4 w-full rounded-full"
                onClick={() => {
                  advance(booking.id);
                  toast.success("Return initiated");
                }}
              >
                Confirm return
              </Button>
            ) : (
              <div className="mt-4 grid gap-4">
                <div>
                  <p className="text-sm font-medium">Equipment condition</p>
                  <RadioGroup value={condition} onValueChange={setCondition} className="mt-2 gap-2">
                    {CONDITIONS.map((c) => (
                      <div key={c} className="flex items-center gap-2">
                        <RadioGroupItem value={c} id={`cond-${c}`} />
                        <Label htmlFor={`cond-${c}`}>{c}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <Button
                  variant="secondary"
                  className="rounded-full"
                  onClick={() => toast.success("Photo upload ready", { description: "Demo — no file stored." })}
                >
                  + Upload photos
                </Button>
                <Textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Write feedback..."
                  className="min-h-24 rounded-2xl"
                />
                <Button
                  className="rounded-full"
                  onClick={() => {
                    update(booking.id, {
                      returnCondition: condition,
                      returnComments: comments,
                      stage: 6,
                    });
                    toast.success("Return report submitted", { description: `Condition: ${condition}` });
                  }}
                >
                  Submit return report
                </Button>

                <div className="rounded-2xl border border-warn/40 bg-warn/10 p-4">
                  <p className="text-sm font-medium">⚠ Report equipment damage</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Opens a dispute review instead of charging anyone automatically.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Mechanical fault", "Body damage", "Missing part", "Fuel/oil leak"].map((x) => (
                      <button
                        key={x}
                        onClick={() => setDamageIssue(x)}
                        className={
                          damageIssue === x
                            ? "rounded-full bg-forest px-3 py-1.5 text-xs text-forest-foreground"
                            : "rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary"
                        }
                      >
                        {x}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="secondary"
                    className="mt-3 rounded-full"
                    disabled={!damageIssue}
                    onClick={() => {
                      update(booking.id, {
                        damageReport: { issue: damageIssue, description: comments },
                      });
                      notify({
                        icon: "⚠",
                        title: "Damage report filed",
                        body: `${damageIssue} on ${booking.title}. Deposit held while support reviews.`,
                      });
                      toast.success("Damage report submitted", {
                        description: "Support will review the evidence from both sides.",
                      });
                    }}
                  >
                    Submit damage report
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* Rating */}
        {stage === 6 ? (
          <div className="surface p-6">
            <p className="mono-label text-primary">Rate your rental</p>
            <h2 className="mt-2 text-lg font-semibold">How was your experience? ⭐</h2>
            <div className="mt-4 grid gap-3">
              {(
                [
                  ["overall", "Overall"],
                  ["condition", "Equipment condition"],
                  ["communication", "Owner communication"],
                  ["timeliness", "Timeliness"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setStars((s) => ({ ...s, [key]: n }))}
                        aria-label={`${label} ${n} stars`}
                        className={n <= stars[key] ? "text-sun" : "text-muted-foreground/40"}
                      >
                        ★
                      </button>
                    ))}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">Rent this again?</span>
                <span className="flex gap-2">
                  {[true, false].map((v) => (
                    <button
                      key={String(v)}
                      onClick={() => setRentAgain(v)}
                      className={
                        rentAgain === v
                          ? "rounded-full bg-forest px-3.5 py-1.5 text-sm text-forest-foreground"
                          : "rounded-full bg-secondary px-3.5 py-1.5 text-sm text-secondary-foreground"
                      }
                    >
                      {v ? "Yes" : "No"}
                    </button>
                  ))}
                </span>
              </div>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Type your feedback..."
                className="min-h-24 rounded-2xl"
              />
              <Button
                className="rounded-full"
                onClick={() => {
                  update(booking.id, {
                    review: { ...stars, rentAgain, feedback },
                    stage: 7,
                  });
                  notify({
                    icon: "⭐",
                    title: "Review submitted",
                    body: `${booking.title} rated ${stars.overall}/5. Owner and equipment ratings updated.`,
                  });
                  toast.success("Review submitted", {
                    description: "Equipment, owner and your own reputation have been updated.",
                  });
                }}
              >
                Submit review
              </Button>
            </div>
          </div>
        ) : null}

        {stage === 7 ? (
          <div className="surface p-6">
            <p className="mono-label text-primary">Transaction completed</p>
            <h2 className="mt-2 text-lg font-semibold">Everything settled 🎉</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Payment released, deposit refunded and ratings applied. Booking{" "}
              <span className="font-mono">{booking.id}</span>.
            </p>
            {booking.review ? (
              <p className="mt-2 text-sm text-sun">
                {"★".repeat(booking.review.overall)} · {booking.returnCondition ?? "Good"} condition
              </p>
            ) : null}
            <div className="mt-4 grid gap-2">
              <Button asChild variant="secondary" className="rounded-full">
                <Link to="/ledger">View transaction</Link>
              </Button>
              <Button asChild className="rounded-full">
                <Link to="/dashboard">Open impact dashboard</Link>
              </Button>
            </div>
          </div>
        ) : null}

        {/* Owner rates the farmer — two-sided reputation */}
        {stage === 7 ? (
          <div className="surface p-6">
            <p className="mono-label text-primary">Owner rates the farmer</p>
            <h2 className="mt-2 text-lg font-semibold">Rate the renter</h2>
            {booking.ownerReview ? (
              <p className="mt-2 text-sm text-sun">
                {"★".repeat(booking.ownerReview.overall)} submitted · reputation updated
              </p>
            ) : (
              <div className="mt-4 grid gap-3">
                {(
                  [
                    ["overall", "Overall"],
                    ["condition", "Equipment handling"],
                    ["communication", "Communication"],
                    ["timeliness", "Timely return"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between gap-3">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          onClick={() => setOwnerStars((s) => ({ ...s, [key]: n }))}
                          aria-label={`Farmer ${label} ${n} stars`}
                          className={n <= ownerStars[key] ? "text-sun" : "text-muted-foreground/40"}
                        >
                          ★
                        </button>
                      ))}
                    </span>
                  </div>
                ))}
                <Textarea
                  value={ownerFeedback}
                  onChange={(e) => setOwnerFeedback(e.target.value)}
                  placeholder="How was renting to this farmer?"
                  className="min-h-20 rounded-2xl"
                />
                <Button
                  className="rounded-full"
                  onClick={() => {
                    update(booking.id, {
                      ownerReview: {
                        ...ownerStars,
                        rentAgain: true,
                        feedback: ownerFeedback,
                      },
                    });
                    toast.success("Farmer rated", {
                      description: "Both reputations are now updated for this transaction.",
                    });
                  }}
                >
                  Submit review
                </Button>
              </div>
            )}
          </div>
        ) : null}

        {/* Reputation */}
        <div className="surface p-6">
          <p className="mono-label text-primary">Reputation</p>
          <p className="mt-2 font-medium">
            {booking.owner} <span className="text-primary">✓ Verified owner</span>
          </p>
          <p className="text-sm text-sun">★ 4.9 / 5 · 47 rentals</p>
          <div className="mt-3 grid gap-1.5 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>On-time dispatch</span>
              <span className="font-medium text-foreground">98%</span>
            </div>
            <div className="flex justify-between">
              <span>Response rate</span>
              <span className="font-medium text-foreground">96%</span>
            </div>
            <div className="flex justify-between">
              <span>Successful transactions</span>
              <span className="font-medium text-foreground">99%</span>
            </div>
          </div>
          <p className="mono-label mt-5 text-primary">Equipment health</p>
          <div className="mt-2 grid gap-1.5 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Current condition</span>
              <span className="font-medium text-foreground">
                {booking.returnCondition ?? "Excellent"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Last inspection</span>
              <span className="font-medium text-foreground">Sep 25, 2026</span>
            </div>
            <div className="flex justify-between">
              <span>Maintenance</span>
              <span className="font-medium text-foreground">Due in 32 hours</span>
            </div>
          </div>
        </div>

        <div className="surface p-6">
          <p className="mono-label text-primary">Booking summary</p>
          <dl className="mt-4 grid gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Booking ID</dt>
              <dd className="font-mono">{booking.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Rental</dt>
              <dd>
                {booking.from} – {booking.to}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Rental amount</dt>
              <dd>₹{booking.amount.toLocaleString("en-IN")}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Security deposit</dt>
              <dd>₹{booking.deposit.toLocaleString("en-IN")}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Distance</dt>
              <dd className="flex items-center gap-1">
                <MapPin className="size-3.5 text-primary" />
                {booking.distanceKm} km
              </dd>
            </div>
          </dl>
          <Button asChild variant="secondary" className="mt-4 w-full rounded-full">
            <Link to="/resource/$id" params={{ id: booking.resourceId }}>
              View equipment details
            </Link>
          </Button>
        </div>
      </aside>
    </section>
  );
}
