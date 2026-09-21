import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { PolicyBody, type PolicySection } from "@/components/policy-body";

export const Route = createFileRoute("/data-sharing-policy")({
  head: () => ({
    meta: [
      { title: "Data Sharing Policy — AgriXchange" },
      {
        name: "description",
        content:
          "How AgriXchange handles farm data across four levels — private, cooperative, regional and anonymous research — and how you change them.",
      },
      { property: "og:title", content: "AgriXchange data sharing policy" },
      {
        property: "og:description",
        content: "Private, cooperative, regional and anonymous research data explained.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DataSharingPolicyPage,
});

const sections: PolicySection[] = [
  {
    title: "You decide, stream by stream",
    body: "Soil moisture, weather, crop health, drone imagery, yield and pest sightings are separate streams. Each one has its own level and you can change any of them at any time on the Data Exchange page.",
  },
  {
    title: "Private",
    body: "Visible only to you. Used to generate your own recommendations and never pooled into regional figures or shown to other members.",
  },
  {
    title: "Cooperative",
    body: "Shared with the specific groups you have joined. Members of those groups see the readings; nobody outside them does.",
  },
  {
    title: "Regional",
    body: "Contributed to the AgriPulse block-level picture. Readings are aggregated with other farms, so what others see is a regional figure and a farm count — never your individual sensor trace or field boundary.",
  },
  {
    title: "Public",
    body: "Open to everyone on the exchange. Appropriate for weather and pest sightings, where a fast warning helps neighbours more than privacy costs you.",
  },
  {
    title: "Anonymous research",
    body: "Yield data may be offered to agricultural research pools stripped of your name, mobile number and exact coordinates. Participation is optional and reversible.",
  },
  {
    title: "Location data",
    body: "Public listings show an approximate distance rather than coordinates. Precise location is exchanged only between the two parties of an active booking, and only while that booking is running.",
  },
  {
    title: "AI processing",
    body: "Recommendations are generated from pooled sensor and weather data and are labelled as AI recommendations, separately from verified sensor readings. You can always see which is which before acting.",
  },
];

function DataSharingPolicyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Data sharing policy"
        description="Four levels of sharing, one rule: nothing leaves your farm unless you choose it."
      />
      <PolicyBody updated="Updated September 2026" sections={sections} />
    </>
  );
}
