import { useState } from "react";
import { Crosshair, MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n";
import type { GeoLocation } from "@/lib/session";

const SUGGESTIONS: GeoLocation[] = [
  { label: "Nandyal, Andhra Pradesh", lat: 15.478, lng: 78.483, precise: false },
  { label: "Banaganapalle, Andhra Pradesh", lat: 15.316, lng: 78.226, precise: false },
  { label: "Kurnool, Andhra Pradesh", lat: 15.828, lng: 78.037, precise: false },
  { label: "Hyderabad, Telangana", lat: 17.385, lng: 78.4867, precise: false },
  { label: "Warangal, Telangana", lat: 17.978, lng: 79.594, precise: false },
  { label: "Dhone, Andhra Pradesh", lat: 15.395, lng: 77.872, precise: false },
];

export function LocationPicker({
  value,
  onChange,
  trigger,
}: {
  value: GeoLocation | null;
  onChange: (loc: GeoLocation) => void;
  trigger?: React.ReactNode;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<GeoLocation | null>(value);
  const [marker, setMarker] = useState({ x: 50, y: 50 });
  const [locating, setLocating] = useState(false);

  const results = SUGGESTIONS.filter((s) =>
    s.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  function useCurrentLocation() {
    setLocating(true);
    if (!("geolocation" in navigator)) {
      setLocating(false);
      toast.error("This device does not support location access");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setDraft({
          label: `Current location (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`,
          lat: Number(pos.coords.latitude.toFixed(4)),
          lng: Number(pos.coords.longitude.toFixed(4)),
          precise: true,
        });
        toast.success("Location detected");
      },
      () => {
        setLocating(false);
        toast.error("Location permission denied", {
          description: "Search for your village or place the marker manually instead.",
        });
      },
      { timeout: 8000 },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="secondary" className="w-full justify-start gap-2 rounded-2xl">
            <MapPin className="size-4 text-primary" />
            {value ? value.label : t("Select Your Location")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-3xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="size-5 text-primary" /> {t("Select Your Location")}
          </DialogTitle>
        </DialogHeader>

        <Button
          onClick={useCurrentLocation}
          disabled={locating}
          className="w-full gap-2 rounded-full"
        >
          <Crosshair className="size-4" />
          {locating ? "Detecting…" : t("Use My Current Location")}
        </Button>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> OR <span className="h-px flex-1 bg-border" />
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-border px-3">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search village, town, district..."
            className="h-11 border-0 px-0 shadow-none focus-visible:ring-0"
          />
        </div>

        {query ? (
          <div className="grid gap-1">
            {results.map((r) => (
              <button
                key={r.label}
                onClick={() => setDraft(r)}
                className="rounded-xl px-3 py-2 text-left text-sm hover:bg-secondary"
              >
                📍 {r.label}
              </button>
            ))}
            {results.length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted-foreground">
                No match. Place the marker on the map instead.
              </p>
            ) : null}
          </div>
        ) : null}

        <button
          type="button"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setMarker({ x, y });
            setDraft({
              label: "Pinned location, Nandyal block",
              lat: Number((15.3 + (100 - y) / 180).toFixed(4)),
              lng: Number((78.1 + x / 180).toFixed(4)),
              precise: true,
            });
          }}
          className="bg-field-grid relative h-44 w-full overflow-hidden rounded-2xl border border-border bg-secondary/50"
          aria-label="Place location marker"
        >
          <span
            className="absolute -translate-x-1/2 -translate-y-full text-2xl"
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
          >
            📍
          </span>
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
            Tap the map to move the marker
          </span>
        </button>

        <div className="rounded-2xl bg-secondary/60 p-4 text-sm">
          <p className="mono-label text-primary">Selected location</p>
          <p className="mt-1 font-medium">{draft ? draft.label : "Nothing selected yet"}</p>
          {draft ? (
            <p className="font-mono text-xs text-muted-foreground">
              📍 {draft.lat}, {draft.lng}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-muted-foreground">
            Public listings only show an approximate distance. Precise coordinates are shared during
            an active booking.
          </p>
        </div>

        <Button
          className="w-full rounded-full"
          disabled={!draft}
          onClick={() => {
            if (!draft) return;
            onChange(draft);
            setOpen(false);
            toast.success("Location confirmed", { description: draft.label });
          }}
        >
          {t("Confirm Location")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
