import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { PolicyBody, type PolicySection } from "@/components/policy-body";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — AgriXchange" },
      {
        name: "description",
        content:
          "The rules for using AgriXchange: accounts, listings, bookings, payments, conduct, liability and how disputes are handled.",
      },
      { property: "og:title", content: "AgriXchange terms & conditions" },
      {
        property: "og:description",
        content: "Accounts, listings, bookings, payments, conduct and dispute handling.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermsPage,
});

const sections: PolicySection[] = [
  {
    title: "Your account",
    body: "An AgriXchange account is tied to one verified mobile number. You are responsible for the number on file and for keeping your session secure. Accounts may be suspended for repeated failed verification, fraudulent listings or abuse of other members.",
  },
  {
    title: "Listing resources",
    body: "Everything you list — machinery, seeds, fertiliser, water, storage, labour or energy — must exist, belong to you or be yours to share, and be described accurately including condition, capacity and availability dates.",
  },
  {
    title: "Bookings and payments",
    body: "A booking becomes binding once the owner accepts it. The rental amount and the security deposit are held in the transparent ledger until the equipment is returned and inspected, at which point payment is released to the owner and the deposit returned to the renter.",
  },
  {
    title: "Conduct on the exchange",
    body: "Treat other members as neighbours. No harassment, no misleading listings, no attempts to move a booking off the exchange to avoid the ledger, and no sharing another member's contact details or location without their consent.",
  },
  {
    title: "Liability",
    body: "AgriXchange is the platform that connects members; the owner and the renter remain responsible for the physical resource, safe operation and any insurance or licences their local rules require.",
  },
  {
    title: "Disputes",
    body: "Damage claims and disagreements go through the dispute workflow: both parties submit evidence, the transaction stays in escrow, and support reviews the condition history before any deduction is made.",
  },
  {
    title: "Prototype notice",
    body: "This build is a demonstration. Data, phone numbers, transactions and tracking are simulated and no real payment is taken.",
  },
];

function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms & conditions"
        description="Plain-language rules that keep a shared-equipment network fair for everybody on it."
      />
      <PolicyBody updated="Updated September 2026" sections={sections} />
    </>
  );
}
