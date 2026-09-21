import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BellRing,
  CreditCard,
  Database,
  Globe,
  HelpCircle,
  LogOut,
  MapPin,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/lib/i18n";
import { useSession, type NotificationPrefs, type Role } from "@/lib/session";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Profile & Settings — AgriXchange" },
      {
        name: "description",
        content:
          "Your AgriXchange profile, reputation, role, language, notification preferences, location privacy and data permissions in one place.",
      },
      { property: "og:title", content: "AgriXchange profile & settings" },
      {
        property: "og:description",
        content: "Change your role, language, notifications and privacy settings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const roles: Array<{ value: Role; emoji: string; label: string; detail: string }> = [
  { value: "farmer", emoji: "👨‍🌾", label: "Farmer", detail: "Find resources, rent equipment, share data" },
  { value: "owner", emoji: "🚜", label: "Resource Owner", detail: "List equipment, track bookings, earn" },
  { value: "both", emoji: "🤝", label: "Farmer + Owner", detail: "Use every AgriXchange feature" },
];

const prefRows: Array<{ key: keyof NotificationPrefs; label: string }> = [
  { key: "booking", label: "Booking updates" },
  { key: "tracking", label: "Equipment tracking" },
  { key: "ai", label: "AI recommendations" },
  { key: "weather", label: "Weather alerts" },
  { key: "pest", label: "Pest alerts" },
  { key: "community", label: "Community updates" },
  { key: "marketing", label: "Marketing" },
];

function SettingsPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { profile, bookings, notificationPrefs, setNotificationPref, updateProfile, signOut } =
    useSession();

  const completed = bookings.filter((b) => b.stage >= 7).length;
  const name = profile?.name || "Guest farmer";

  return (
    <>
      <PageHeader
        eyebrow="Profile & settings"
        title={`${name}`}
        description="Everything about your account: reputation, role, language, notifications, privacy and data sharing."
      />

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="grid h-fit gap-6">
          <div className="surface p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-forest text-xl text-forest-foreground">
                <UserRound className="size-6" />
              </span>
              <div>
                <p className="font-display text-lg font-bold">{name}</p>
                <Badge className="mt-1 rounded-full bg-primary text-primary-foreground">
                  <ShieldCheck className="mr-1 size-3" /> Verified{" "}
                  {profile?.role === "owner" ? "Owner" : "Farmer"}
                </Badge>
              </div>
            </div>

            <dl className="mt-5 grid gap-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Mobile</dt>
                <dd className="font-mono">
                  {profile ? `${profile.countryCode} ${profile.mobile}` : "Not signed in"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Farm</dt>
                <dd>
                  {profile?.farmSize ?? 25} acres · {profile?.crop ?? "Cotton"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Farm location</dt>
                <dd className="flex items-center gap-1">
                  <MapPin className="size-3.5 text-primary" />
                  {profile?.location?.label ?? "Not set"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Reputation</dt>
                <dd className="flex items-center gap-1">
                  <Star className="size-3.5 text-sun" /> 4.8 / 5
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Completed rentals</dt>
                <dd>{23 + completed}</dd>
              </div>
            </dl>

            <div className="mt-5 grid gap-2">
              <Button asChild variant="secondary" className="rounded-full">
                <Link to="/auth">Edit profile details</Link>
              </Button>
              <Button
                variant="ghost"
                className="gap-2 rounded-full text-destructive"
                onClick={() => {
                  signOut();
                  toast.success("Signed out");
                  navigate({ to: "/", replace: true });
                }}
              >
                <LogOut className="size-4" /> {t("Log out")}
              </Button>
            </div>
          </div>

          <div className="surface p-6">
            <p className="mono-label text-primary">Reputation breakdown</p>
            <div className="mt-4 grid gap-2 text-sm">
              {[
                ["On-time returns", "100%"],
                ["Good equipment handling", "97%"],
                ["Response rate", "96%"],
                ["Successful transactions", "99%"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Calculated from your transaction history on the exchange.
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="surface p-6">
            <p className="mono-label flex items-center gap-2 text-primary">
              <Globe className="size-4" /> {t("Language")}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              The whole interface, notifications and the AgriAI assistant switch to this language.
            </p>
            <div className="mt-4">
              <LanguageSwitcher />
            </div>
          </div>

          <div className="surface p-6">
            <p className="mono-label text-primary">How you use AgriXchange</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {roles.map((r) => (
                <button
                  key={r.value}
                  onClick={() => {
                    updateProfile({ role: r.value });
                    toast.success(`Role updated to ${r.label}`);
                  }}
                  className={
                    "rounded-2xl border p-4 text-left transition-colors " +
                    (profile?.role === r.value
                      ? "border-primary bg-secondary/70"
                      : "border-border hover:bg-secondary/50")
                  }
                >
                  <span className="text-2xl">{r.emoji}</span>
                  <p className="mt-2 font-medium">{r.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{r.detail}</p>
                </button>
              ))}
            </div>
            {profile ? null : (
              <p className="mt-3 text-xs text-muted-foreground">
                Sign in first to save a role to your account.
              </p>
            )}
          </div>

          <div className="surface p-6">
            <p className="mono-label flex items-center gap-2 text-primary">
              <BellRing className="size-4" /> {t("Notifications")}
            </p>
            <div className="mt-4 grid gap-3">
              {prefRows.map((row) => (
                <label
                  key={row.key}
                  className="flex cursor-pointer items-center justify-between gap-3 text-sm"
                >
                  {t(row.label)}
                  <Checkbox
                    checked={notificationPrefs[row.key]}
                    onCheckedChange={(v) => {
                      setNotificationPref(row.key, Boolean(v));
                      toast.success(`${row.label} ${v ? "on" : "off"}`);
                    }}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="surface p-6">
            <p className="mono-label text-primary">More settings</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Button asChild variant="secondary" className="justify-start gap-2 rounded-full">
                <Link to="/privacy">
                  <MapPin className="size-4" /> Location & privacy
                </Link>
              </Button>
              <Button asChild variant="secondary" className="justify-start gap-2 rounded-full">
                <Link to="/data-exchange">
                  <Database className="size-4" /> Data permissions
                </Link>
              </Button>
              <Button asChild variant="secondary" className="justify-start gap-2 rounded-full">
                <Link to="/ledger">
                  <CreditCard className="size-4" /> Transactions & payments
                </Link>
              </Button>
              <Button asChild variant="secondary" className="justify-start gap-2 rounded-full">
                <Link to="/support">
                  <HelpCircle className="size-4" /> {t("Help Center")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
