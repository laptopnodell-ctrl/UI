import { createFileRoute, Link } from "@tanstack/react-router";
import { BottomNav } from "@/components/vino/BottomNav";
import { ProductTile } from "@/components/vino/ProductCard";
import { EmptyState, Icon, Screen, Stepper, TopBar, VegBadge } from "@/components/vino/ui";
import { getProduct, inr, popularPicks } from "@/lib/vino-data";
import { useVino } from "@/lib/vino-store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — Vino Tasty Hub" },
      {
        name: "description",
        content: "Review your Vino Tasty Hub order, apply a coupon and proceed to checkout.",
      },
      { property: "og:title", content: "Your cart — Vino Tasty Hub" },
      { property: "og:description", content: "Check your items and bill before checkout." },
    ],
  }),
  component: Cart,
});

export function BillDetails() {
  const { bill } = useVino();
  const rows = [
    { label: "Item Total", value: inr(bill.itemTotal) },
    { label: "Delivery Fee", value: bill.deliveryFee ? inr(bill.deliveryFee) : "FREE" },
    { label: "Taxes", value: inr(bill.taxes) },
  ];
  return (
    <div className="vino-card mx-4 p-4">
      <h2 className="text-[15px] font-bold text-foreground">Bill Details</h2>
      <dl className="mt-3 flex flex-col gap-2 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between">
            <dt className="text-muted-foreground">{r.label}</dt>
            <dd className="font-semibold text-foreground">{r.value}</dd>
          </div>
        ))}
        {bill.discount ? (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Discount</dt>
            <dd className="font-semibold text-success">-{inr(bill.discount)}</dd>
          </div>
        ) : null}
        <div className="mt-2 border-t border-border pt-2" />
        <div className="flex justify-between text-base">
          <dt className="font-bold text-foreground">Total</dt>
          <dd className="font-extrabold text-foreground">{inr(bill.total)}</dd>
        </div>
      </dl>
    </div>
  );
}

function Cart() {
  const { cart, setQty, removeLine, bill, coupon } = useVino();

  if (!cart.length) {
    return (
      <Screen>
        <TopBar title="Your Cart" back="/home" />
        <EmptyState
          icon="remove_shopping_cart"
          title="Your cart is empty"
          text="Looks like you haven't added anything delicious yet."
          ctaLabel="EXPLORE MENU"
          ctaTo="/categories"
        />
        <BottomNav />
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar title="Your Cart" subtitle={`${bill.count} items`} back="/home" />

      <div className="flex flex-col gap-3 px-4 pt-4">
        {cart.map((line) => {
          const p = getProduct(line.productId);
          if (!p) return null;
          return (
            <article key={line.key} className="vino-card flex gap-3 p-3">
              <img src={p.image} alt={p.name} className="size-20 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-2">
                  <VegBadge veg={p.veg} />
                  <p className="flex-1 text-sm font-bold text-foreground">{p.name}</p>
                  <button
                    type="button"
                    aria-label={`Remove ${p.name}`}
                    onClick={() => removeLine(line.key)}
                  >
                    <Icon name="delete" className="text-lg text-muted-foreground" />
                  </button>
                </div>
                {line.variant ? (
                  <p className="mt-0.5 text-[11px] text-muted-foreground">Size: {line.variant}</p>
                ) : null}
                {line.addons.length ? (
                  <p className="text-[11px] text-muted-foreground">Add-ons: {line.addons.join(", ")}</p>
                ) : null}
                <Link
                  to="/product/$id"
                  params={{ id: p.id }}
                  className="mt-1 inline-block text-[11px] font-bold text-primary-deep"
                >
                  Edit customization
                </Link>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-base font-bold text-foreground">
                    {inr(line.unitPrice * line.qty)}
                  </span>
                  <Stepper qty={line.qty} onChange={(n) => setQty(line.key, n)} small />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="px-4 pt-4">
        <Link
          to="/categories"
          className="vino-card flex items-center gap-2 px-4 py-3 text-sm font-bold text-primary-deep"
        >
          <Icon name="add" className="text-lg" /> Add more items
        </Link>
      </div>

      <section className="pt-6">
        <h2 className="px-4 text-[15px] font-bold text-foreground">Frequently bought together</h2>
        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-4 pb-1">
          {popularPicks.map((p) => (
            <ProductTile key={p.id} product={p} />
          ))}
        </div>
      </section>

      <div className="px-4 pt-6">
        <Link to="/coupons" className="vino-card flex items-center gap-3 px-4 py-3">
          <span className="grid size-9 place-items-center rounded-full bg-secondary text-primary-deep">
            <Icon name="local_offer" className="text-lg" />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-foreground">
              {coupon ? `${coupon.code} applied` : "Apply Coupon"}
            </span>
            <span className="block text-[11px] text-muted-foreground">
              {coupon ? coupon.title : "Save more on this order"}
            </span>
          </span>
          <Icon name="chevron_right" className="text-muted-foreground" />
        </Link>
      </div>

      <div className="pt-4">
        <BillDetails />
      </div>

      <div className="fixed inset-x-0 bottom-20 z-40 mx-auto max-w-md px-4">
        <Link to="/checkout" className="vino-cta vino-cta-press">
          PROCEED TO CHECKOUT · {inr(bill.total)}
        </Link>
      </div>

      <BottomNav />
    </Screen>
  );
}
