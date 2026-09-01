import { createFileRoute, Link } from "@tanstack/react-router";
import { BottomNav } from "@/components/vino/BottomNav";
import { Screen, TopBar } from "@/components/vino/ui";
import { getProduct, inr } from "@/lib/vino-data";
import { useVino } from "@/lib/vino-store";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My orders — Vino Tasty Hub" },
      { name: "description", content: "See your past Vino Tasty Hub orders, reorder favourites and track deliveries." },
      { property: "og:title", content: "My orders — Vino Tasty Hub" },
      { property: "og:description", content: "Your order history and live deliveries in one place." },
    ],
  }),
  component: Orders,
});

const statusStyle = {
  delivered: "bg-success/15 text-success",
  cancelled: "bg-destructive/10 text-destructive",
  "on-the-way": "bg-secondary text-primary-deep",
  preparing: "bg-secondary text-primary-deep",
  "order-placed": "bg-secondary text-primary-deep",
} as const;

const statusLabel = {
  delivered: "Delivered",
  cancelled: "Cancelled",
  "on-the-way": "On the way",
  preparing: "Preparing",
  "order-placed": "Order Placed",
} as const;

function Orders() {
  const { orders } = useVino();

  return (
    <Screen>
      <TopBar title="My Orders" />

      <div className="flex flex-col gap-3 px-4 pt-4">
        {orders.map((o) => {
          const isActive = o.status === "preparing" || o.status === "order-placed" || o.status === "on-the-way";
          return (
            <article key={o.id} className="vino-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-foreground">#{o.id}</p>
                  <p className="text-[11px] text-muted-foreground">{o.placedAt}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusStyle[o.status]}`}>
                  {statusLabel[o.status]}
                </span>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                {o.items.map((it) => {
                  const p = getProduct(it.productId);
                  if (!p) return null;
                  return (
                    <div key={it.productId} className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="size-11 rounded-lg object-cover" />
                      <p className="flex-1 truncate text-sm font-semibold text-foreground">{p.name}</p>
                      <span className="text-xs text-muted-foreground">x{it.qty}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm font-extrabold text-foreground">{inr(o.total)}</span>
                <div className="flex items-center gap-2">
                  {isActive && (
                    <Link
                      to="/track/$id"
                      params={{ id: o.id }}
                      search={{ cancel: "true" }}
                      className="rounded-full border border-destructive/40 bg-destructive/5 px-3 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      Cancel Order
                    </Link>
                  )}
                  {isActive && (
                    <Link
                      to="/track/$id"
                      params={{ id: o.id }}
                      className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-xs"
                    >
                      TRACK
                    </Link>
                  )}
                  <Link
                    to="/order/$id"
                    params={{ id: o.id }}
                    className="rounded-full border border-border px-3.5 py-1.5 text-xs font-bold text-foreground hover:bg-muted"
                  >
                    DETAILS
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <BottomNav />
    </Screen>
  );
}
