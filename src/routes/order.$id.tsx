import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Icon, Screen, TopBar } from "@/components/vino/ui";
import { getProduct, inr, pastOrders } from "@/lib/vino-data";
import { useVino } from "@/lib/vino-store";

export const Route = createFileRoute("/order/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Order ${params.id} details — Vino Tasty Hub` },
      { name: "description", content: "Invoice, items and delivery details for your Vino Tasty Hub order." },
      { property: "og:title", content: `Order ${params.id} details — Vino Tasty Hub` },
      { property: "og:description", content: "Full bill breakdown and reorder in one tap." },
    ],
  }),
  component: OrderDetail,
});

function OrderDetail() {
  const { id } = Route.useParams();
  const order = pastOrders.find((o) => o.id === id) ?? pastOrders[0];
  const { addToCart } = useVino();

  const itemTotal = order.items.reduce((s, it) => {
    const p = getProduct(it.productId);
    return s + (p ? p.price * it.qty : 0);
  }, 0);
  const taxes = Math.round(itemTotal * 0.05);
  const deliveryFee = itemTotal >= 499 ? 0 : 40;

  const reorder = () => {
    order.items.forEach((it) => {
      const p = getProduct(it.productId);
      if (p) addToCart({ productId: p.id, qty: it.qty, addons: [], unitPrice: p.price });
    });
    toast.success("Items added to your cart");
  };

  return (
    <Screen>
      <TopBar title={`Order #${order.id}`} subtitle={order.placedAt} back="/orders" />

      <section className="px-4 pt-4">
        <div className="vino-card divide-y divide-border">
          {order.items.map((it) => {
            const p = getProduct(it.productId);
            if (!p) return null;
            return (
              <div key={it.productId} className="flex items-center gap-3 p-3">
                <img src={p.image} alt={p.name} className="size-12 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-foreground">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">Qty {it.qty}</p>
                </div>
                <span className="text-sm font-bold text-foreground">{inr(p.price * it.qty)}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="text-[15px] font-bold text-foreground">Bill details</h2>
        <dl className="vino-card mt-2 flex flex-col gap-2 p-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Item Total</dt>
            <dd className="font-semibold text-foreground">{inr(itemTotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Delivery Fee</dt>
            <dd className="font-semibold text-foreground">{deliveryFee ? inr(deliveryFee) : "FREE"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Taxes</dt>
            <dd className="font-semibold text-foreground">{inr(taxes)}</dd>
          </div>
          <div className="mt-1 flex justify-between border-t border-border pt-2 text-base">
            <dt className="font-bold text-foreground">Total paid</dt>
            <dd className="font-extrabold text-foreground">{inr(order.total)}</dd>
          </div>
        </dl>
      </section>

      <section className="px-4 pt-6">
        <div className="vino-card flex items-start gap-3 p-4">
          <span className="grid size-9 place-items-center rounded-full bg-secondary text-primary-deep">
            <Icon name="location_on" className="text-lg" />
          </span>
          <p className="flex-1 text-xs text-muted-foreground">
            Delivered to Home · 12B, Palm Grove Apartments, Panampilly Nagar, Kochi 682036
          </p>
        </div>
      </section>

      <div className="flex gap-3 px-4 pt-6">
        <button type="button" onClick={reorder} className="vino-cta vino-cta-press flex-1">
          REORDER
        </button>
        <Link
          to="/help"
          className="grid place-items-center rounded-full border border-border px-5 text-sm font-bold text-foreground"
        >
          Help
        </Link>
      </div>
    </Screen>
  );
}
