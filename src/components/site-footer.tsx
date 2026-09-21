import { Link } from "@tanstack/react-router";
import { Sprout } from "lucide-react";
import { languages, useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { setLang, t } = useI18n();

  return (
    <footer className="mt-24 bg-forest pb-20 text-forest-foreground md:pb-0">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-lime text-lime-foreground">
              <Sprout className="size-5" />
            </span>
            <span className="font-display text-lg font-bold">AgriXchange</span>
          </div>
          <p className="mt-4 max-w-md text-sm text-forest-foreground/70">
            Share resources. Share knowledge. Grow smarter. The operating system for shared
            agriculture — machinery, inputs, data and knowledge exchanged between farmers you can
            trust.
          </p>
          <a
            href="tel:1800-000-0000"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-lime px-4 py-2.5 text-sm font-medium text-lime-foreground"
          >
            📞 {t("Customer Care")} · 1800-000-0000
          </a>
          <p className="mt-2 text-xs text-forest-foreground/50">Demo number · available 24/7</p>
        </div>

        <div>
          <p className="mono-label text-lime">Platform</p>
          <div className="mt-4 grid gap-2 text-sm text-forest-foreground/75">
            <Link to="/marketplace">{t("Marketplace")}</Link>
            <Link to="/equipment">Equipment sharing</Link>
            <Link to="/data-exchange">{t("Data Exchange")}</Link>
            <Link to="/ai-insights">AgriPulse</Link>
            <Link to="/map">{t("Resource Map")}</Link>
            <Link to="/community">{t("Community")}</Link>
            <Link to="/dashboard">{t("Dashboard")}</Link>
            <Link to="/settings">Profile & settings</Link>
          </div>
        </div>

        <div>
          <p className="mono-label text-lime">{t("Support")}</p>
          <div className="mt-4 grid gap-2 text-sm text-forest-foreground/75">
            <Link to="/support">{t("Customer Care")}</Link>
            <Link to="/support">{t("Help Center")}</Link>
            <Link to="/support">Contact us</Link>
            <Link to="/support">Report an issue</Link>
          </div>

          <p className="mono-label mt-8 text-lime">Legal</p>
          <div className="mt-4 grid gap-2 text-sm text-forest-foreground/75">
            <Link to="/privacy">Privacy policy</Link>
            <Link to="/terms">Terms & conditions</Link>
            <Link to="/data-sharing-policy">Data sharing policy</Link>
            <Link to="/rental-policy">Rental policy</Link>
            <Link to="/community">Community guidelines</Link>
          </div>
        </div>

        <div>
          <p className="mono-label text-lime">Languages</p>
          <div className="mt-4 grid gap-2 text-sm text-forest-foreground/75">
            {languages.map((l) => (
              <button key={l.code} onClick={() => setLang(l.code)} className="text-left">
                {l.native}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-forest-foreground/10 px-4 py-6 text-center text-xs text-forest-foreground/50">
        Demo data for prototype purposes. © 2026 AgriXchange.
      </div>
    </footer>
  );
}
