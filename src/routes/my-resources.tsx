import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  IndianRupee,
  MapPin,
  Plus,
  Star,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { LocationPicker } from "@/components/location-picker";
import { useI18n } from "@/lib/i18n";
import { useSession } from "@/lib/session";
import {
  monthlyEarnings,
  resourceStatuses,
  resourceTypes,
  typeDef,
  type MaintenanceRecord,
  type OwnedResource,
  type ResourceStatus,
} from "@/lib/owner-resources";

export const Route = createFileRoute("/my-resources")({
  head: () => ({
    meta: [
      { title: "My Resources — AgriXchange owner console" },
      {
        name: "description",
        content:
          "Add, edit, price and publish equipment, manage availability, maintenance, booking requests and earnings as an AgriXchange resource owner.",
      },
      { property: "og:title", content: "Resource owner console — AgriXchange" },
      {
        property: "og:description",
        content:
          "Complete control of your shared farm resources: listings, availability calendar, bookings, maintenance and earnings.",
      },
    ],
  }),
  component: MyResources,
});

const statusTone: Record<ResourceStatus, string> = {
  Available: "bg-primary/15 text-primary",
  Rented: "bg-navy/10 text-navy",
  Reserved: "bg-sun/20 text-foreground",
  Maintenance: "bg-destructive/10 text-destructive",
  Inactive: "bg-muted text-muted-foreground",
};

const conditions = ["Excellent", "Good", "Fair", "Damaged"];
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

type Draft = {
  id?: string;
  type: string;
  name: string;
  price: string;
  deposit: string;
  condition: string;
  status: ResourceStatus;
  locationLabel: string;
  description: string;
  photos: string[];
  specs: Record<string, string>;
};

function emptyDraft(): Draft {
  return {
    type: "tractor",
    name: "",
    price: "",
    deposit: "",
    condition: "Excellent",
    status: "Available",
    locationLabel: "Nandyal, Andhra Pradesh",
    description: "",
    photos: [],
    specs: {},
  };
}

function draftFrom(r: OwnedResource): Draft {
  return {
    id: r.id,
    type: r.type,
    name: r.name,
    price: String(r.price),
    deposit: String(r.deposit),
    condition: r.condition,
    status: r.status,
    locationLabel: r.locationLabel,
    description: r.description,
    photos: r.photos,
    specs: { ...r.specs },
  };
}

function MyResources() {
  const { t } = useI18n();
  const {
    profile,
    ownedResources,
    bookingRequests,
    addResource,
    updateResource,
    removeResource,
    setResourceStatus,
    toggleBlockedDate,
    addMaintenance,
    setRequestStatus,
    addNotification,
    nextResourceId,
  } = useSession();

  const [filter, setFilter] = useState<"All" | ResourceStatus>("All");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [preview, setPreview] = useState<Draft | null>(null);
  const [calendarFor, setCalendarFor] = useState<OwnedResource | null>(null);
  const [maintenanceFor, setMaintenanceFor] = useState<OwnedResource | null>(null);
  const [removeFor, setRemoveFor] = useState<OwnedResource | null>(null);

  const live = ownedResources.filter((r) => r.active);
  const visible = live.filter(
    (r) =>
      (filter === "All" || r.status === filter) &&
      (query.trim() === "" || r.name.toLowerCase().includes(query.trim().toLowerCase())),
  );

  const summary = useMemo(() => {
    const rented = live.filter((r) => r.status === "Rented").length;
    const available = live.filter((r) => r.status === "Available").length;
    const maintenance = live.filter((r) => r.status === "Maintenance").length;
    const earned = live.reduce((a, r) => a + r.stats.earned, 0);
    const rating = live.length
      ? live.reduce((a, r) => a + r.stats.rating, 0) / live.length
      : 0;
    return { total: live.length, rented, available, maintenance, earned, rating };
  }, [live]);

  const ownerName = profile?.name?.split(" ")[0] ?? "Ravi";

  function saveDraft(d: Draft, publish: boolean) {
    const def = typeDef(d.type);
    if (!d.name.trim()) {
      toast.error(t("Resource Name") + " " + t("is required"));
      return;
    }
    const price = Number(d.price) || 0;
    const base = {
      type: d.type,
      name: d.name.trim(),
      emoji: def.emoji,
      category: def.category,
      unit: def.unit,
      price,
      deposit: Number(d.deposit) || 0,
      condition: d.condition,
      status: d.status,
      locationLabel: d.locationLabel,
      description: d.description,
      photos: d.photos,
      specs: d.specs,
      published: publish,
    };
    if (d.id) {
      updateResource(d.id, base);
      toast.success(`${d.name} ${t("updated")}`);
    } else {
      addResource({
        id: nextResourceId(),
        ...base,
        distanceKm: 8.4,
        blockedDates: [],
        maintenance: [],
        nextServiceHours: 180,
        active: true,
        activeBookings: 0,
        stats: {
          rating: 0,
          rentals: 0,
          earned: 0,
          utilization: 0,
          maintenanceEvents: 0,
          avgDays: 0,
        },
      });
      addNotification({
        icon: def.emoji,
        title: "Listing published",
        body: `${d.name.trim()} is now visible to farmers within 30 km.`,
      });
      toast.success(publish ? `${d.name} ${t("published")}` : `${d.name} ${t("saved as draft")}`);
    }
    setDraft(null);
    setPreview(null);
  }

  return (
    <>
      <PageHeader
        eyebrow={t("Manage Resources")}
        title={`${t("Good evening")}, ${ownerName} 👋 — ${t("Resource Owner Dashboard")}`}
        description={t(
          "Everything you share in one place: listings, pricing, availability, booking requests, maintenance and earnings.",
        )}
      >
        <div className="flex flex-wrap gap-3">
          <Button className="rounded-full" onClick={() => setDraft(emptyDraft())}>
            <Plus className="mr-1 size-4" />
            {t("Add Resource")}
          </Button>
          <Button asChild variant="secondary" className="rounded-full">
            <Link to="/dashboard">{t("Dashboard")}</Link>
          </Button>
        </div>
      </PageHeader>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {[
            { l: t("Total Resources"), v: String(summary.total) },
            { l: t("Active Rentals"), v: String(summary.rented) },
            { l: t("Available"), v: String(summary.available) },
            { l: t("Under Maintenance"), v: String(summary.maintenance) },
            { l: t("Total Earnings"), v: inr(summary.earned) },
            { l: t("Average Rating"), v: `⭐ ${summary.rating.toFixed(1)}` },
          ].map((s) => (
            <div key={s.l} className="surface p-5">
              <p className="mono-label text-muted-foreground">{s.l}</p>
              <p className="mt-2 font-display text-2xl font-bold">{s.v}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="resources" className="mt-10">
          <TabsList className="flex-wrap">
            <TabsTrigger value="resources">{t("My Resources")}</TabsTrigger>
            <TabsTrigger value="bookings">{t("Bookings")}</TabsTrigger>
            <TabsTrigger value="earnings">{t("Earnings")}</TabsTrigger>
          </TabsList>

          {/* ---------------- Resources ---------------- */}
          <TabsContent value="resources" className="mt-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex min-w-60 flex-1 items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
                <Star className="size-4 shrink-0 text-muted-foreground" />
                <input
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder={`${t("Search")}…`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {(["All", "Available", "Rented", "Maintenance", "Inactive"] as const).map((f) => (
                  <Button
                    key={f}
                    size="sm"
                    variant={filter === f ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => setFilter(f)}
                  >
                    {t(f)}
                  </Button>
                ))}
              </div>
            </div>

            {visible.length === 0 ? (
              <div className="surface mt-6 p-10 text-center">
                <p className="text-lg font-semibold">{t("No resources found")}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("Add your first resource or clear the filters.")}
                </p>
                <Button className="mt-5 rounded-full" onClick={() => setDraft(emptyDraft())}>
                  <Plus className="mr-1 size-4" />
                  {t("Add Resource")}
                </Button>
              </div>
            ) : (
              <div className="mt-6 grid gap-4">
                {visible.map((r) => (
                  <article key={r.id} className="surface p-5">
                    <div className="flex flex-wrap items-start gap-4">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl">
                        {r.emoji}
                      </span>
                      <div className="min-w-48 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{r.name}</h3>
                          <Badge className={statusTone[r.status]} variant="secondary">
                            {t(r.status)}
                          </Badge>
                          {r.published ? null : (
                            <Badge variant="outline">{t("Draft")}</Badge>
                          )}
                        </div>
                        <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <IndianRupee className="size-3.5" />
                            {r.price.toLocaleString("en-IN")}/{r.unit}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="size-3.5 text-primary" />~{r.distanceKm}{" "}
                            {t("km away")}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Star className="size-3.5 text-sun" />
                            {r.stats.rating || "—"} · {r.stats.rentals} {t("Completed Rentals")}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Wrench className="size-3.5" />
                            {r.nextServiceHours} h {t("to next service")}
                          </span>
                        </p>
                      </div>
                      <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                        <Select
                          value={r.status}
                          onValueChange={(v) => {
                            setResourceStatus(r.id, v as ResourceStatus);
                            toast.success(`${r.name} → ${t(v)}`);
                          }}
                        >
                          <SelectTrigger className="w-40 rounded-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {resourceStatuses.map((s) => (
                              <SelectItem key={s.value} value={s.value}>
                                {s.dot} {t(s.value)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full"
                          onClick={() => setDraft(draftFrom(r))}
                        >
                          {t("Edit")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full"
                          onClick={() => setCalendarFor(r)}
                        >
                          <CalendarDays className="mr-1 size-4" />
                          {t("Availability")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full"
                          onClick={() => setMaintenanceFor(r)}
                        >
                          <Wrench className="mr-1 size-4" />
                          {t("Maintenance")}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-full text-destructive"
                          onClick={() => setRemoveFor(r)}
                        >
                          <Trash2 className="mr-1 size-4" />
                          {t("Remove")}
                        </Button>
                      </div>
                    </div>

                    {/* performance */}
                    <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-3 lg:grid-cols-6">
                      {[
                        { l: t("Rating"), v: `⭐ ${r.stats.rating || "—"}` },
                        { l: t("Completed Rentals"), v: String(r.stats.rentals) },
                        { l: t("Total Earnings"), v: inr(r.stats.earned) },
                        { l: t("Utilization"), v: `${r.stats.utilization}%` },
                        { l: t("Maintenance"), v: String(r.stats.maintenanceEvents) },
                        { l: t("Average rental"), v: `${r.stats.avgDays} ${t("days")}` },
                      ].map((x) => (
                        <div key={x.l}>
                          <p className="mono-label text-muted-foreground">{x.l}</p>
                          <p className="mt-1 font-semibold">{x.v}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ---------------- Bookings ---------------- */}
          <TabsContent value="bookings" className="mt-6">
            <div className="grid gap-4">
              {bookingRequests.map((b) => (
                <div key={b.id} className="surface flex flex-wrap items-center gap-4 p-5">
                  <span className="text-2xl">{b.emoji}</span>
                  <div className="min-w-48 flex-1">
                    <p className="font-semibold">
                      {b.farmer} · {b.resourceName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {b.from} – {b.to} · {inr(b.amount)} ·{" "}
                      <span className="font-mono text-xs">{b.id}</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("Contact shared only for active bookings")}: {b.farmerMobile}
                    </p>
                  </div>
                  <Badge variant="secondary">{t(b.status)}</Badge>
                  <div className="flex flex-wrap gap-2">
                    {b.status === "Pending" ? (
                      <>
                        <Button
                          size="sm"
                          className="rounded-full"
                          onClick={() => {
                            setRequestStatus(b.id, "Accepted");
                            addNotification({
                              icon: "✅",
                              title: "Booking confirmed",
                              body: `${b.farmer} was notified that ${b.resourceName} is confirmed.`,
                            });
                            toast.success(`${t("Booking confirmed")} ✓`);
                          }}
                        >
                          {t("Accept")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full"
                          onClick={() => {
                            setRequestStatus(b.id, "Cancelled");
                            toast(`${t("Declined")} · ${b.farmer}`);
                          }}
                        >
                          {t("Decline")}
                        </Button>
                      </>
                    ) : null}
                    <Button asChild size="sm" variant="ghost" className="rounded-full">
                      <Link to="/booking/$id" params={{ id: b.id }}>
                        {t("View details")}
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ---------------- Earnings ---------------- */}
          <TabsContent value="earnings" className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { l: t("This Month"), v: inr(18500) },
                { l: t("This Year"), v: inr(142000) },
                { l: t("Completed Rentals"), v: "47" },
                { l: t("Pending Payments"), v: inr(4200) },
              ].map((s) => (
                <div key={s.l} className="surface p-5">
                  <p className="mono-label text-muted-foreground">{s.l}</p>
                  <p className="mt-2 font-display text-2xl font-bold text-gradient-agri">{s.v}</p>
                </div>
              ))}
            </div>
            <div className="surface mt-6 p-6">
              <p className="mono-label text-primary">{t("Monthly Earnings")}</p>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyEarnings}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                    <RTooltip formatter={(v: number) => inr(v)} />
                    <Bar dataKey="amount" fill="var(--color-primary)" radius={8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* ---------------- Add / edit dialog ---------------- */}
      <Dialog open={!!draft} onOpenChange={(o) => (o ? null : setDraft(null))}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
          {draft ? (
            <>
              <DialogHeader>
                <DialogTitle>{draft.id ? t("Edit Resource") : t("Add Resource")}</DialogTitle>
                <DialogDescription>
                  {t("Only the fields that matter for this resource type are shown.")}
                </DialogDescription>
              </DialogHeader>
              <ResourceForm draft={draft} onChange={setDraft} />
              <DialogFooter className="gap-2">
                <Button variant="outline" className="rounded-full" onClick={() => setDraft(null)}>
                  {t("Cancel")}
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-full"
                  onClick={() => setPreview(draft)}
                >
                  {t("Preview")}
                </Button>
                <Button className="rounded-full" onClick={() => saveDraft(draft, true)}>
                  {draft.id ? t("Save") : t("Publish")}
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* ---------------- Listing preview ---------------- */}
      <Dialog open={!!preview} onOpenChange={(o) => (o ? null : setPreview(null))}>
        <DialogContent className="sm:max-w-md">
          {preview ? (
            <>
              <DialogHeader>
                <DialogTitle>{t("Listing preview")}</DialogTitle>
                <DialogDescription>
                  {t("This is how farmers will see your listing.")}
                </DialogDescription>
              </DialogHeader>
              <div className="surface p-5">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{typeDef(preview.type).emoji}</span>
                  <span className="mono-label text-primary">{t("Rent")}</span>
                </div>
                <h3 className="mt-3 font-semibold">{preview.name || t("Resource Name")}</h3>
                <p className="mt-2 font-display text-xl font-bold">
                  ₹{(Number(preview.price) || 0).toLocaleString("en-IN")}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{typeDef(preview.type).unit}
                  </span>
                </p>
                <div className="mt-3 grid gap-1.5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Star className="size-4 text-sun" />
                    4.8
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4 text-primary" />~8.4 {t("km away")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BadgeCheck className="size-4 text-primary" />
                    {t(preview.condition)} · {t("Verified owner")}
                  </span>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" className="rounded-full" onClick={() => setPreview(null)}>
                  {t("Edit")}
                </Button>
                <Button className="rounded-full" onClick={() => saveDraft(preview, true)}>
                  {t("Publish")}
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* ---------------- Availability calendar ---------------- */}
      <Dialog open={!!calendarFor} onOpenChange={(o) => (o ? null : setCalendarFor(null))}>
        <DialogContent className="sm:max-w-lg">
          {calendarFor ? (
            <AvailabilityCalendar
              resource={ownedResources.find((r) => r.id === calendarFor.id) ?? calendarFor}
              onToggle={(iso) => toggleBlockedDate(calendarFor.id, iso)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      {/* ---------------- Maintenance ---------------- */}
      <Dialog open={!!maintenanceFor} onOpenChange={(o) => (o ? null : setMaintenanceFor(null))}>
        <DialogContent className="sm:max-w-md">
          {maintenanceFor ? (
            <MaintenanceForm
              resource={maintenanceFor}
              onSubmit={(rec) => {
                addMaintenance(maintenanceFor.id, rec);
                addNotification({
                  icon: "🔧",
                  title: "Maintenance scheduled",
                  body: `${maintenanceFor.name} is hidden from available listings until service is done.`,
                });
                toast.success(t("Maintenance scheduled"));
                setMaintenanceFor(null);
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      {/* ---------------- Remove safety ---------------- */}
      <Dialog open={!!removeFor} onOpenChange={(o) => (o ? null : setRemoveFor(null))}>
        <DialogContent className="sm:max-w-md">
          {removeFor ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  {t("Remove")} {removeFor.name}?
                </DialogTitle>
                <DialogDescription>
                  {removeFor.activeBookings > 0
                    ? `${t("This resource has")} ${removeFor.activeBookings} ${t(
                        "active bookings. You cannot permanently remove it until they are completed. You can mark it inactive instead.",
                      )}`
                    : t(
                        "This removes the resource from your active marketplace listings. Confirmed bookings are not cancelled automatically and transaction history is kept.",
                      )}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setRemoveFor(null)}
                >
                  {t("Cancel")}
                </Button>
                {removeFor.activeBookings > 0 ? (
                  <Button
                    className="rounded-full"
                    onClick={() => {
                      setResourceStatus(removeFor.id, "Inactive");
                      toast.success(`${removeFor.name} → ${t("Inactive")}`);
                      setRemoveFor(null);
                    }}
                  >
                    {t("Mark as Inactive")}
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    className="rounded-full"
                    onClick={() => {
                      removeResource(removeFor.id);
                      toast.success(`${removeFor.name} ${t("removed from listings")}`);
                      setRemoveFor(null);
                    }}
                  >
                    {t("Remove Resource")}
                  </Button>
                )}
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ------------------------------------------------------------------ */

function ResourceForm({
  draft,
  onChange,
}: {
  draft: Draft;
  onChange: (d: Draft) => void;
}) {
  const { t } = useI18n();
  const def = typeDef(draft.type);
  const fileRef = useRef<HTMLInputElement>(null);

  function addPhotos(files: FileList | null) {
    if (!files) return;
    const room = 8 - draft.photos.length;
    const chosen = Array.from(files).slice(0, Math.max(0, room));
    if (chosen.length === 0) {
      toast.error(t("You can upload up to 8 photos."));
      return;
    }
    chosen.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const url = String(reader.result);
        onChange({ ...draft, photos: [...draft.photos, url].slice(0, 8) });
      };
      reader.readAsDataURL(file);
    });
  }

  function movePhoto(i: number, dir: -1 | 1) {
    const next = [...draft.photos];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    const a = next[i]!;
    next[i] = next[j]!;
    next[j] = a;
    onChange({ ...draft, photos: next });
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label>{t("Select Resource Type")}</Label>
        <Select
          value={draft.type}
          onValueChange={(v) => onChange({ ...draft, type: v, specs: {} })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {resourceTypes.map((r) => (
              <SelectItem key={r.key} value={r.key}>
                {r.emoji} {t(r.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>{t("Resource Name")}</Label>
        <Input
          value={draft.name}
          placeholder="Mahindra 575 DI Tractor"
          onChange={(e) => onChange({ ...draft, name: e.target.value })}
        />
      </div>

      {/* type-specific fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        {def.fields.map((f) => (
          <div key={f.key} className="grid gap-2">
            <Label>{t(f.label)}</Label>
            <Input
              type={f.kind === "number" ? "number" : "text"}
              value={draft.specs[f.key] ?? ""}
              placeholder={f.placeholder}
              onChange={(e) =>
                onChange({ ...draft, specs: { ...draft.specs, [f.key]: e.target.value } })
              }
            />
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label>
            {t("Rental Price")} (₹/{def.unit})
          </Label>
          <Input
            type="number"
            value={draft.price}
            placeholder="1800"
            onChange={(e) => onChange({ ...draft, price: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label>{t("Security Deposit")} (₹)</Label>
          <Input
            type="number"
            value={draft.deposit}
            placeholder="5000"
            onChange={(e) => onChange({ ...draft, deposit: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label>{t("Condition")}</Label>
          <Select
            value={draft.condition}
            onValueChange={(v) => onChange({ ...draft, condition: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {conditions.map((c) => (
                <SelectItem key={c} value={c}>
                  {t(c)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>{t("Availability")}</Label>
          <Select
            value={draft.status}
            onValueChange={(v) => onChange({ ...draft, status: v as ResourceStatus })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {resourceStatuses.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.dot} {t(s.value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label>{t("Location")}</Label>
        <LocationPicker
          value={{ label: draft.locationLabel, lat: 17.41, lng: 78.47, precise: false }}
          onChange={(loc) => onChange({ ...draft, locationLabel: loc.label })}
        />
        <p className="text-xs text-muted-foreground">
          {t("Farmers only see an approximate distance until a booking is confirmed.")}
        </p>
      </div>

      <div className="grid gap-2">
        <Label>{t("Description")}</Label>
        <Textarea
          rows={3}
          value={draft.description}
          onChange={(e) => onChange({ ...draft, description: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <Label>
          {t("Photos")} ({draft.photos.length}/8)
        </Label>
        <div className="flex flex-wrap gap-3">
          {draft.photos.map((p, i) => (
            <div key={`${i}-${p.slice(-12)}`} className="relative">
              <img
                src={p}
                alt=""
                className="size-20 rounded-xl border border-border object-cover"
              />
              {i === 0 ? (
                <Badge className="absolute -top-2 left-0" variant="secondary">
                  {t("Primary")}
                </Badge>
              ) : null}
              <div className="mt-1 flex justify-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-6"
                  onClick={() => movePhoto(i, -1)}
                >
                  <ArrowLeft className="size-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-6"
                  onClick={() => movePhoto(i, 1)}
                >
                  <ArrowRight className="size-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-6 text-destructive"
                  onClick={() =>
                    onChange({ ...draft, photos: draft.photos.filter((_, k) => k !== i) })
                  }
                >
                  <X className="size-3" />
                </Button>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            className="h-20 rounded-xl"
            onClick={() => fileRef.current?.click()}
          >
            <Plus className="mr-1 size-4" />
            {t("Upload Images")}
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addPhotos(e.target.files)}
          />
        </div>
      </div>
    </div>
  );
}

function AvailabilityCalendar({
  resource,
  onToggle,
}: {
  resource: OwnedResource;
  onToggle: (iso: string) => void;
}) {
  const { t } = useI18n();
  const year = 2026;
  const month = 8; // September
  const first = new Date(Date.UTC(year, month, 1));
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const pad = first.getUTCDay();
  const booked = ["2026-09-24", "2026-09-25"];

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {t("Manage Availability")} · {resource.name}
        </DialogTitle>
        <DialogDescription>
          {t("Tap a date to block or open it. Booked and maintenance dates are locked.")}
        </DialogDescription>
      </DialogHeader>
      <p className="mono-label text-primary">September 2026</p>
      <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={`${d}${i}`} className="py-1 text-muted-foreground">
            {d}
          </span>
        ))}
        {Array.from({ length: pad }).map((_, i) => (
          <span key={`pad${i}`} />
        ))}
        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1;
          const iso = `2026-09-${String(day).padStart(2, "0")}`;
          const isBooked = booked.includes(iso);
          const isMaintenance = resource.maintenance.some((m) => m.date === iso);
          const isBlocked = resource.blockedDates.includes(iso);
          const cls = isBooked
            ? "bg-navy/15 text-navy"
            : isMaintenance
              ? "bg-destructive/15 text-destructive"
              : isBlocked
                ? "bg-muted text-muted-foreground line-through"
                : "bg-primary/10 text-primary hover:bg-primary/20";
          return (
            <button
              key={iso}
              type="button"
              disabled={isBooked || isMaintenance}
              onClick={() => onToggle(iso)}
              className={`rounded-lg py-2 text-sm font-medium transition ${cls} disabled:cursor-not-allowed`}
            >
              {day}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span>🟩 {t("Available")}</span>
        <span>🟦 {t("Booked")}</span>
        <span>⬜ {t("Blocked")}</span>
        <span>🟥 {t("Maintenance")}</span>
      </div>
    </>
  );
}

function MaintenanceForm({
  resource,
  onSubmit,
}: {
  resource: OwnedResource;
  onSubmit: (rec: MaintenanceRecord) => void;
}) {
  const { t } = useI18n();
  const [date, setDate] = useState("2026-09-28");
  const [kind, setKind] = useState("Routine service");
  const [cost, setCost] = useState("2400");
  const [notes, setNotes] = useState("");
  const [next, setNext] = useState("2026-12-01");

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {t("Schedule Maintenance")} · {resource.name}
        </DialogTitle>
        <DialogDescription>
          {t(
            "While maintenance is active the resource is hidden from available marketplace results.",
          )}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label>{t("Service date")}</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>{t("Maintenance type")}</Label>
          <Input value={kind} onChange={(e) => setKind(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>{t("Cost")} (₹)</Label>
          <Input type="number" value={cost} onChange={(e) => setCost(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>{t("Notes")}</Label>
          <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>{t("Next service date")}</Label>
          <Input type="date" value={next} onChange={(e) => setNext(e.target.value)} />
        </div>
      </div>
      <DialogFooter>
        <Button
          className="rounded-full"
          onClick={() =>
            onSubmit({ date, kind, cost: Number(cost) || 0, notes, nextService: next })
          }
        >
          {t("Schedule Maintenance")}
        </Button>
      </DialogFooter>
    </>
  );
}
