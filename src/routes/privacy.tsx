import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { MapPin, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dataStreams, visibilityLevels, type Visibility } from "@/lib/agri-data";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy & Permissions — AgriXchange" },
      {
        name: "description",
        content:
          "Control who sees your farm location and which farm data streams are private, cooperative, regional or public.",
      },
      { property: "og:title", content: "AgriXchange privacy & data permissions" },
      {
        property: "og:description",
        content: "Location visibility and per-stream data sharing controls for every farmer.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { locationPermissions, setLocationPermissions, dataPermissions, setDataPermission } =
    useSession();

  const locationRows = [
    {
      key: "marketplace" as const,
      label: "Marketplace listings",
      body: "What other farmers see when browsing your listings.",
      options: ["hidden", "approximate", "precise"] as const,
      value: locationPermissions.marketplace,
    },
    {
      key: "activeBooking" as const,
      label: "Active booking",
      body: "Shared only with the other party while a rental is in progress.",
      options: ["approximate", "precise"] as const,
      value: locationPermissions.activeBooking,
    },
    {
      key: "publicProfile" as const,
      label: "Public profile",
      body: "Visible to anyone viewing your AgriXchange profile.",
      options: ["hidden", "approximate"] as const,
      value: locationPermissions.publicProfile,
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Privacy & permissions"
        title="You decide what the network sees"
        description="AgriXchange uses location and farm data to match resources. Every stream has its own visibility, and exact coordinates are never public by default."
      />

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-2">
        <div className="surface p-6">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            <p className="mono-label text-primary">Location sharing</p>
          </div>
          <div className="mt-5 grid gap-4">
            {locationRows.map((row) => (
              <div key={row.key} className="rounded-2xl border border-border p-4">
                <p className="font-medium">{row.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{row.body}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {row.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setLocationPermissions({ [row.key]: opt });
                        toast.success(`${row.label}: ${opt} location`);
                      }}
                      className={
                        row.value === opt
                          ? "rounded-full bg-forest px-3.5 py-1.5 text-sm capitalize text-forest-foreground"
                          : "rounded-full bg-secondary px-3.5 py-1.5 text-sm capitalize text-secondary-foreground hover:bg-muted"
                      }
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            <p className="mono-label text-primary">My data permissions</p>
          </div>
          <div className="mt-5 grid gap-3">
            {dataStreams.map((stream) => {
              const current = (dataPermissions[stream.id] ?? stream.visibility) as Visibility;
              return (
                <div
                  key={stream.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border p-4"
                >
                  <div>
                    <p className="font-medium">{stream.name}</p>
                    <p className="text-xs text-muted-foreground">Shared with {stream.sharedWith}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {visibilityLevels.map((level) => (
                      <button
                        key={level}
                        onClick={() => {
                          setDataPermission(stream.id, level);
                          toast.success(`${stream.name} → ${level}`);
                        }}
                        className={
                          current === level
                            ? "rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                            : "rounded-full bg-secondary px-3 py-1.5 text-xs text-secondary-foreground hover:bg-muted"
                        }
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary" className="rounded-full">
              Anonymous research pool
            </Badge>
            Yield data contributes to regional models without identifying your farm.
          </div>
          <Button asChild variant="secondary" className="mt-5 w-full rounded-full">
            <a href="/data-exchange">Open data exchange</a>
          </Button>
        </div>
      </section>
    </>
  );
}
