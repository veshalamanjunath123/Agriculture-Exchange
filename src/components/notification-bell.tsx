import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useI18n } from "@/lib/i18n";
import { useSession } from "@/lib/session";

export function NotificationBell() {
  const { t } = useI18n();
  const { notifications, markNotificationsRead } = useSession();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger
        className="relative flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
        aria-label={`${t("Notifications")}${unread ? ` (${unread} unread)` : ""}`}
      >
        <Bell className="size-5" />
        {unread ? (
          <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground">
            {unread}
          </span>
        ) : null}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 rounded-2xl p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="font-display font-semibold">🔔 {t("Notifications")}</p>
          {unread ? (
            <button onClick={markNotificationsRead} className="text-xs text-primary">
              Mark all read
            </button>
          ) : null}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">Nothing yet.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={
                  "flex gap-3 border-b border-border/60 px-4 py-3 text-sm last:border-0 " +
                  (n.read ? "" : "bg-secondary/50")
                }
              >
                <span className="text-lg">{n.icon}</span>
                <div>
                  <p className="font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.body}</p>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">{n.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
