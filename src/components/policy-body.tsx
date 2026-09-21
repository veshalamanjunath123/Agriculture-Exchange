import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export type PolicySection = { title: string; body: string };

export function PolicyBody({
  updated,
  sections,
}: {
  updated: string;
  sections: PolicySection[];
}) {
  return (
    <section className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-10 sm:px-6">
      <p className="mono-label text-primary">{updated}</p>

      <div className="surface grid gap-6 p-6 sm:p-8">
        {sections.map((s, i) => (
          <div key={s.title} className={i === 0 ? "" : "border-t border-border pt-6"}>
            <h2 className="font-display text-lg font-bold">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="surface flex flex-wrap items-center gap-3 p-6">
        <p className="flex-1 text-sm text-muted-foreground">
          Questions about any of this? Customer care is available 24/7.
        </p>
        <Button asChild variant="secondary" className="rounded-full">
          <Link to="/support">Contact support</Link>
        </Button>
        <Button asChild className="rounded-full">
          <Link to="/privacy">Privacy & permissions</Link>
        </Button>
      </div>
    </section>
  );
}
