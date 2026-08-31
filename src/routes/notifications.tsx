import { createFileRoute } from "@tanstack/react-router";
import { Icon, Screen, TopBar } from "@/components/vino/ui";
import { notifications } from "@/lib/vino-data";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Vino Tasty Hub" },
      { name: "description", content: "Order updates, offers and reminders from Vino Tasty Hub." },
      { property: "og:title", content: "Notifications — Vino Tasty Hub" },
      { property: "og:description", content: "Stay on top of your deliveries and deals." },
    ],
  }),
  component: Notifications,
});

function Notifications() {
  return (
    <Screen padBottom={false}>
      <TopBar title="Notifications" back="/profile" />
      <div className="flex flex-col gap-3 px-4 pt-4 pb-10">
        {notifications.map((n) => (
          <article key={n.id} className="vino-card flex gap-3 p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-primary-deep">
              <Icon name={n.icon} className="text-lg" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">{n.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
              <p className="mt-1 text-[11px] font-semibold text-muted-foreground">{n.time}</p>
            </div>
          </article>
        ))}
      </div>
    </Screen>
  );
}
