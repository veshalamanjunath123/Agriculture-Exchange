import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Sprout, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NotificationBell } from "@/components/notification-bell";
import { useI18n } from "@/lib/i18n";
import { useSession } from "@/lib/session";

const nav = [
  { to: "/marketplace", label: "Marketplace" },
  { to: "/equipment", label: "Equipment" },
  { to: "/data-exchange", label: "Data Exchange" },
  { to: "/ai-insights", label: "AI Insights" },
  { to: "/map", label: "Resource Map" },
  { to: "/community", label: "Community" },
  { to: "/ledger", label: "Ledger" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const { profile, signOut } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex size-9 items-center justify-center rounded-xl bg-forest text-forest-foreground">
            <Sprout className="size-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">AgriXchange</span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 xl:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {t(item.label)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <NotificationBell />
          {profile?.onboarded ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden rounded-full lg:inline-flex">
                <Link to="/dashboard">{t("Dashboard")}</Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="hidden rounded-full lg:inline-flex">
                <Link to="/settings">{t("Settings")}</Link>
              </Button>
              <button
                onClick={signOut}
                aria-label="Sign out"
                className="hidden size-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-secondary lg:flex"
              >
                <LogOut className="size-4" />
              </button>
            </>
          ) : (
            <Button asChild size="sm" className="hidden rounded-full lg:inline-flex">
              <Link to="/auth">{t("Log in")}</Link>
            </Button>
          )}

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="flex size-10 items-center justify-center rounded-xl border border-border xl:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-background px-4 pb-4 xl:hidden">
          <nav className="grid gap-1 py-2">
            {[
              ...nav,
              { to: "/dashboard", label: "Dashboard" },
              { to: "/settings", label: "Profile & settings" },
              { to: "/privacy", label: "Privacy & permissions" },
              { to: "/support", label: "Support" },
              { to: "/auth", label: profile?.onboarded ? "Profile" : "Log in" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground" }}
              >
                {t(item.label)}
              </Link>
            ))}
          </nav>
          <div className="pt-2 sm:hidden">
            <LanguageSwitcher />
          </div>
        </div>
      ) : null}
    </header>
  );
}
