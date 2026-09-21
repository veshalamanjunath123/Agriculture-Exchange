import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, MessageSquare, LifeBuoy, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Help & Customer Care — AgriXchange" },
      {
        name: "description",
        content:
          "Call customer care, start a chat with support, browse the help centre or report an issue with a rental, payment or data permission.",
      },
      { property: "og:title", content: "AgriXchange help & customer care" },
      {
        property: "og:description",
        content: "24/7 phone support, chat support and a farmer help centre.",
      },
    ],
  }),
  component: Support,
});

const FAQS = [
  {
    q: "How do I book equipment near me?",
    a: "Open the Marketplace or Resource Map, filter by distance and category, then open the equipment page and tap Request Equipment. The owner confirms and a rental contract is created automatically.",
  },
  {
    q: "Who can see my farm location?",
    a: "Public listings only show approximate distance. Precise coordinates are shared with the other party while a booking is active, and never on your public profile unless you enable it.",
  },
  {
    q: "What happens if equipment arrives late or damaged?",
    a: "Report it from the booking page before starting the rental. The condition report and photos are attached to the transaction, and the payment stays in escrow until both sides confirm.",
  },
  {
    q: "How is my rating calculated?",
    a: "Your rating combines completed transactions, on-time returns, equipment condition reports and the star ratings left by the other party.",
  },
  {
    q: "Can I use AgriXchange in my language?",
    a: "Yes. Use the 🌐 language selector in the header, the login screen or inside the AgriAI assistant. Your choice is remembered on this device.",
  },
];

function Support() {
  const [issue, setIssue] = useState("");
  const [contact, setContact] = useState("");

  return (
    <>
      <PageHeader
        eyebrow="Support"
        title="Need help? We're here 24/7"
        description="Phone support in nine languages, chat support for booking and payment issues, and a help centre written for farmers."
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="surface p-6">
            <Phone className="size-6 text-primary" />
            <p className="mono-label mt-4 text-primary">Customer care</p>
            <a href="tel:1800-000-0000" className="mt-2 block font-display text-2xl font-bold">
              1800-000-0000
            </a>
            <p className="mt-1 text-sm text-muted-foreground">
              Available 24/7 · demo number for this prototype
            </p>
            <Button asChild className="mt-4 w-full rounded-full">
              <a href="tel:1800-000-0000">Call customer care</a>
            </Button>
          </div>

          <div className="surface p-6">
            <MessageSquare className="size-6 text-primary" />
            <p className="mono-label mt-4 text-primary">Chat support</p>
            <p className="mt-2 font-display text-2xl font-bold">Live chat</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Typical first reply under 3 minutes.
            </p>
            <Button
              variant="secondary"
              className="mt-4 w-full rounded-full"
              onClick={() =>
                toast.success("Chat support connecting…", {
                  description: "An agent will join this demo conversation shortly.",
                })
              }
            >
              Start chat
            </Button>
          </div>

          <div className="surface p-6">
            <LifeBuoy className="size-6 text-primary" />
            <p className="mono-label mt-4 text-primary">Help centre</p>
            <p className="mt-2 font-display text-2xl font-bold">{FAQS.length} guides</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Bookings, payments, tracking, ratings and data sharing.
            </p>
            <Button asChild variant="secondary" className="mt-4 w-full rounded-full">
              <a href="#help-centre">Browse help</a>
            </Button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div id="help-centre" className="surface p-6">
            <p className="mono-label text-primary">Help centre</p>
            <h2 className="mt-2 text-xl font-semibold">Common questions</h2>
            <Accordion type="single" collapsible className="mt-4">
              {FAQS.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="surface p-6">
            <p className="mono-label text-primary">Report an issue</p>
            <h2 className="mt-2 text-xl font-semibold">Tell us what went wrong</h2>
            <div className="mt-4 grid gap-3">
              <Input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Mobile number or booking ID"
                className="h-12 rounded-2xl"
              />
              <Textarea
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Describe the problem — rental, payment, tracking, data permission..."
                className="min-h-32 rounded-2xl"
              />
              <Button
                className="w-full gap-2 rounded-full"
                onClick={() => {
                  if (!issue.trim()) {
                    toast.error("Please describe the issue first");
                    return;
                  }
                  setIssue("");
                  setContact("");
                  toast.success("Support request created", {
                    description: "Ticket #AGX-SUP-4471 · our team will call you back.",
                  });
                }}
              >
                <Send className="size-4" /> Submit request
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
