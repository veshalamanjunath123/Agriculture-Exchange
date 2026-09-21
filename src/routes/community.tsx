import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, Heart, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { communityPosts, groups } from "@/lib/agri-data";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — AgriXchange" },
      {
        name: "description",
        content:
          "Farmer discussions, local agricultural tips, questions and answers, and cooperative groups pooling machinery and inputs.",
      },
      { property: "og:title", content: "AgriXchange farmer community" },
      {
        property: "og:description",
        content: "Practical advice from farmers growing the same crops in the same block.",
      },
    ],
  }),
  component: Community,
});

const tags = ["All", "Pest control", "Equipment", "Cooperative", "Water"] as const;

function Community() {
  const [tag, setTag] = useState<(typeof tags)[number]>("All");
  const [draft, setDraft] = useState("");

  const posts = communityPosts.filter((p) => tag === "All" || p.tag === tag);

  return (
    <>
      <PageHeader
        eyebrow="Community"
        title="The knowledge exchange behind the resource exchange"
        description="Questions answered by farmers in your block, tips that match your crop and soil, and cooperative groups that negotiate better rates together."
      />

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="surface p-5">
            <p className="mono-label text-primary">Ask the network</p>
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Share a practice, ask a question, or post a local tip..."
              className="mt-3 min-h-24 rounded-2xl"
            />
            <div className="mt-3 flex justify-end">
              <Button
                className="rounded-full"
                disabled={draft.trim().length === 0}
                onClick={() => {
                  toast.success("Posted to Nandyal Cotton Collective", {
                    description: "128 farmers in your block will see this.",
                  });
                  setDraft("");
                }}
              >
                Post
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={
                  t === tag
                    ? "rounded-full bg-forest px-4 py-2 text-sm font-medium text-forest-foreground"
                    : "rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary"
                }
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-4">
            {posts.map((p) => (
              <article key={p.id} className="surface p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-secondary font-display font-bold text-primary">
                    {p.author.charAt(0)}
                  </span>
                  <div>
                    <p className="font-medium">{p.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.village} · {p.time}
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-auto rounded-full">
                    {p.tag}
                  </Badge>
                </div>
                <h2 className="mt-4 text-lg font-semibold">{p.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
                <div className="mt-4 flex gap-5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Heart className="size-4" /> {p.likes}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="size-4" /> {p.replies} replies
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="grid content-start gap-4">
          <div className="surface p-6">
            <p className="mono-label text-primary">Cooperative groups</p>
            <div className="mt-4 grid gap-3">
              {groups.map((g) => (
                <div key={g.name} className="rounded-2xl border border-border p-4">
                  <p className="font-medium">{g.name}</p>
                  <p className="text-xs text-muted-foreground">{g.focus}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="size-4 text-primary" /> {g.members} members
                  </p>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="mt-3 rounded-full"
                    onClick={() => toast.success(`Join request sent to ${g.name}`)}
                  >
                    Request to join
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-dark p-6">
            <p className="mono-label text-lime">Local tip of the day</p>
            <p className="mt-3 text-sm text-forest-foreground/80">
              Black cotton soil after rain: wait 36 hours before rotavating. Working wet soil creates
              a hard pan that cuts root depth for the rest of the season.
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
