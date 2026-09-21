import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { PolicyBody, type PolicySection } from "@/components/policy-body";

export const Route = createFileRoute("/rental-policy")({
  head: () => ({
    meta: [
      { title: "Rental Policy — AgriXchange" },
      {
        name: "description",
        content:
          "How AgriXchange rentals work: booking, cancellation, deposits, equipment condition, damage reporting, the return process and disputes.",
      },
      { property: "og:title", content: "AgriXchange rental policy" },
      {
        property: "og:description",
        content: "Booking, cancellation, deposits, condition, damage reports and returns.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RentalPolicyPage,
});

const sections: PolicySection[] = [
  {
    title: "Booking",
    body: "Send a request with your dates. The owner accepts or declines, and on acceptance the rental amount plus the security deposit are secured in the ledger. Your booking gets a transaction ID you can follow from request to payment release.",
  },
  {
    title: "Cancellation",
    body: "Cancel free of charge until the owner marks the equipment as dispatched. After dispatch, one day of the rental rate may be retained to cover the owner's travel. Owners who cancel after accepting lose reliability points on their reputation score.",
  },
  {
    title: "Security deposit",
    body: "Machinery carries a ₹5,000 deposit and smaller resources ₹1,000. The deposit is released in full once the return inspection records no new damage.",
  },
  {
    title: "Equipment condition",
    body: "Every item carries a condition history — Excellent, Good, Fair or Damaged — recorded at each return along with photos. Check the history and the last inspection date before requesting a machine.",
  },
  {
    title: "Returning equipment",
    body: "Confirm the return in the booking screen, pick the condition, add photos and any comments. The owner then confirms the inspection, which closes the rental and releases the payment.",
  },
  {
    title: "Damage reporting",
    body: "Report damage the same day with photos and a description. The transaction stays in escrow while both parties add evidence — nobody is charged automatically and no party is blamed before review.",
  },
  {
    title: "Disputes",
    body: "If the two sides disagree, support compares the submitted evidence against the condition history and the tracking record for that booking and proposes a settlement.",
  },
];

function RentalPolicyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Rental policy"
        description="What happens at every step of a rental, from request to deposit release."
      />
      <PolicyBody updated="Updated September 2026" sections={sections} />
    </>
  );
}
