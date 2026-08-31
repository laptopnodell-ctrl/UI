import { createFileRoute, Link } from "@tanstack/react-router";
import { Icon, Screen, TopBar } from "@/components/vino/ui";
import { offers } from "@/lib/vino-data";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "Offers & deals — Vino Tasty Hub" },
      { name: "description", content: "Today's Vino Tasty Hub deals on biryani, bakery treats and tea." },
      { property: "og:title", content: "Offers & deals — Vino Tasty Hub" },
      { property: "og:description", content: "Grab discounts before they expire." },
    ],
  }),
  component: Offers,
});

function Offers() {
  return (
    <Screen padBottom={false}>
      <TopBar title="Today's Offers" back="/home" />
      <div className="flex flex-col gap-3 px-4 pt-4 pb-10">
        {offers.map((o) => (
          <article key={o.id} className="vino-card overflow-hidden">
            <img src={o.image} alt={o.title} className="h-36 w-full object-cover" />
            <div className="p-4">
              <h2 className="text-base font-extrabold text-foreground">{o.title}</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">{o.detail}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="rounded-lg border border-dashed border-primary bg-secondary px-2.5 py-1 text-xs font-extrabold tracking-wider text-secondary-foreground">
                  {o.code}
                </span>
                <Link to="/coupons" className="flex items-center gap-1 text-xs font-bold text-primary-deep">
                  APPLY <Icon name="chevron_right" className="text-base" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Screen>
  );
}
