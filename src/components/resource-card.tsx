import { Link } from "@tanstack/react-router";
import { MapPin, Star, CalendarDays, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Resource } from "@/lib/agri-data";

export function ResourceCard({
  resource,
  onRequest,
}: {
  resource: Resource;
  onRequest?: (r: Resource) => void;
}) {
  return (
    <article className="surface group flex flex-col p-5 transition-transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-2xl">
          {resource.emoji}
        </span>
        <div className="flex flex-wrap justify-end gap-1">
          {resource.mode.map((m) => (
            <Badge key={m} variant="secondary" className="rounded-full">
              {m}
            </Badge>
          ))}
        </div>
      </div>

      <h3 className="mt-4 text-base font-semibold leading-snug">{resource.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {resource.owner} · {resource.village}
      </p>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="font-display text-2xl font-bold">
          {resource.price === 0 ? "Exchange" : `₹${resource.price.toLocaleString("en-IN")}`}
        </span>
        {resource.price === 0 ? null : (
          <span className="text-sm text-muted-foreground">/ {resource.unit}</span>
        )}
      </div>

      <dl className="mt-4 grid gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-primary" />
          {resource.distanceKm} km away
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" />
          Available {resource.availableFrom} – {resource.availableTo}
        </div>
        <div className="flex items-center gap-2">
          <Star className="size-4 text-sun" />
          {resource.rating} · {resource.jobs} jobs · {resource.condition}
        </div>
        {resource.verified ? (
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            Verified farmer · {resource.onTimeReturnRate}% on-time
          </div>
        ) : null}
      </dl>

      <div className="mt-5 grid gap-2">
        <Button
          className="w-full rounded-full"
          variant="secondary"
          onClick={() => onRequest?.(resource)}
        >
          {resource.mode.includes("Rent") ? "Request resource" : "Enquire"}
        </Button>
        <Button asChild variant="ghost" className="w-full rounded-full">
          <Link to="/resource/$id" params={{ id: resource.id }}>
            View details
          </Link>
        </Button>
      </div>
    </article>
  );
}
