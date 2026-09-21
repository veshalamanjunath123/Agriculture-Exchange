import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Phone, IdCard, MapPinned, Users, CheckCircle2, Circle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ledger } from "@/lib/agri-data";

export const Route = createFileRoute("/ledger")({
  head: () => ({
    meta: [
      { title: "Trust & Transaction Ledger — AgriXchange" },
      {
        name: "description",
        content:
          "Farmer verification, reputation scores and a transparent smart-contract ledger where payment is released only after a resource returns.",
      },
      { property: "og:title", content: "Trust, verification and a transparent ledger" },
      {
        property: "og:description",
        content: "Every rental is an escrow contract with a visible, tamper-evident history.",
      },
    ],
  }),
  component: Ledger,
});

const verification = [
  { icon: Phone, label: "Phone verification", status: "Verified", note: "+91 ••••• 42180" },
  { icon: IdCard, label: "Government ID / KYC", status: "Verified", note: "Aadhaar-linked (masked)" },
  { icon: MapPinned, label: "Farm verification", status: "Verified", note: "Survey no. 118/2, 25 acres" },
  { icon: Users, label: "Community verification", status: "3 vouches", note: "Nandyal Cotton Collective" },
];

const reputation = [
  { label: "On-time return rate", value: 97 },
  { label: "Equipment condition score", value: 93 },
  { label: "Payment reliability", value: 100 },
  { label: "Response speed", value: 88 },
];

function Ledger() {
  return (
    <>
      <PageHeader
        eyebrow="Trust & transactions"
        title="Peer-to-peer only works when trust is visible"
        description="Layered verification, a reputation record earned through real bookings, and an append-only ledger where every rental is a smart contract with escrowed payment."
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="surface p-6">
            <p className="mono-label text-primary">Farmer verification</p>
            <h2 className="mt-2 text-xl font-semibold">Anitha Reddy · Banaganapalle</h2>
            <div className="mt-5 grid gap-3">
              {verification.map((v) => (
                <div
                  key={v.label}
                  className="flex items-center gap-4 rounded-2xl border border-border p-4"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
                    <v.icon className="size-5" />
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{v.label}</p>
                    <p className="text-xs text-muted-foreground">{v.note}</p>
                  </div>
                  <Badge className="rounded-full bg-primary text-primary-foreground">
                    {v.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="surface p-6">
            <p className="mono-label text-primary">Reputation</p>
            <h2 className="mt-2 text-xl font-semibold">Built from 38 completed transactions</h2>
            <div className="mt-6 grid gap-5">
              {reputation.map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between text-sm">
                    <span>{r.label}</span>
                    <span className="font-mono text-muted-foreground">{r.value}%</span>
                  </div>
                  <Progress value={r.value} className="mt-2 h-2" />
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2 rounded-2xl bg-secondary/60 p-4 text-sm">
              <ShieldCheck className="size-4 text-primary" />
              Trust score 4.8 / 5 · eligible for zero-deposit rentals
            </div>
          </div>
        </div>

        <div className="mt-10">
          <p className="mono-label text-primary">Transaction ledger</p>
          <h2 className="mt-2 text-2xl font-bold">Smart contracts, in the open</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Each record is append-only and hash-chained. Funds move only when both parties confirm
            the resource changed hands and came back as agreed.
          </p>

          <div className="mt-6 grid gap-4">
            {ledger.map((t) => (
              <article key={t.id} className="surface p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm font-semibold">Transaction #{t.id}</span>
                  <Badge
                    className={
                      t.status === "In escrow"
                        ? "rounded-full bg-sun text-forest"
                        : "rounded-full bg-primary text-primary-foreground"
                    }
                  >
                    {t.status}
                  </Badge>
                  <span className="font-mono text-xs text-muted-foreground">{t.hash}</span>
                  <span className="ml-auto text-sm text-muted-foreground">{t.date}</span>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.4fr] lg:items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t.from} → {t.to}
                    </p>
                    <p className="mt-1 font-semibold">{t.item}</p>
                    <p className="mt-2 font-display text-2xl font-bold">
                      {t.amount === 0 ? "Barter exchange" : `₹${t.amount.toLocaleString("en-IN")}`}
                    </p>
                  </div>

                  <ol className="grid gap-2">
                    {t.steps.map((s, i) => (
                      <li key={s} className="flex items-center gap-2 text-sm">
                        {i === t.steps.length - 1 && t.status === "In escrow" ? (
                          <Circle className="size-4 text-sun" />
                        ) : (
                          <CheckCircle2 className="size-4 text-primary" />
                        )}
                        <span className="text-muted-foreground">{s}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
