import { Link } from "@tanstack/react-router";
import { Home, Search, Map, Bot, User } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/marketplace", label: "Explore", icon: Search },
  { to: "/map", label: "Map", icon: Map },
  { to: "/ai-insights", label: "AI", icon: Bot },
  { to: "/dashboard", label: "Profile", icon: User },
] as const;

export function MobileBottomNav() {
  const { t } = useI18n();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-stretch border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] text-muted-foreground"
          activeProps={{ className: "text-primary" }}
        >
          <item.icon className="size-5" />
          {t(item.label)}
        </Link>
      ))}
    </nav>
  );
}
