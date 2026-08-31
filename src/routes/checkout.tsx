import { createFileRoute, Link } from "@tanstack/react-router";
import { EmptyState, Icon, Screen, TopBar } from "@/components/vino/ui";
import { getProduct, inr } from "@/lib/vino-data";
import { useVino } from "@/lib/vino-store";
import { BillDetails } from "./cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Vino Tasty Hub" },
      {
        name: "description",
        content: "Confirm your delivery address, order summary and bill before paying.",
      },
      { property: "og:title", content: "Checkout — Vino Tasty Hub" },
      { property: "og:description", content: "One last look before your food is on its way." },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { cart, addresses, selectedAddressId, bill, coupon, instructions, setInstructions } = useVino();
  const address = addresses.find((a) => a.id === selectedAddressId) ?? addresses[0];

  if (!cart.length) {
    return (
      <Screen padBottom={false}>
        <TopBar title="Checkout" back="/cart" />
        <EmptyState
          icon="shopping_bag"
          title="Nothing to check out"
          text="Add a few dishes to your cart first."
          ctaLabel="EXPLORE MENU"
          ctaTo="/categories"
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar title="Checkout" back="/cart" />

      <section className="px-4 pt-4">
        <h2 className="text-[15px] font-bold text-foreground">Deliver to</h2>
        <Link to="/addresses" className="vino-card mt-2 flex items-start gap-3 p-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-primary-deep">
            <Icon name="location_on" className="text-lg" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-foreground">{address?.label ?? "Add address"}</span>
            <span className="block text-xs text-muted-foreground">
              {address ? `${address.line1}, ${address.line2}, ${address.city} ${address.pin}` : "Tap to add a delivery address"}
            </span>
          </span>
          <span className="text-xs font-bold text-primary-deep">CHANGE</span>
        </Link>
      </section>

      <section className="px-4 pt-6">
        <h2 className="text-[15px] font-bold text-foreground">Order summary</h2>
        <div className="vino-card mt-2 divide-y divide-border">
          {cart.map((l) => {
            const p = getProduct(l.productId);
            if (!p) return null;
            return (
              <div key={l.key} className="flex items-center gap-3 p-3">
                <img src={p.image} alt={p.name} className="size-12 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-foreground">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Qty {l.qty}
                    {l.variant ? ` · ${l.variant}` : ""}
                  </p>
                </div>
                <span className="text-sm font-bold text-foreground">{inr(l.unitPrice * l.qty)}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="text-[15px] font-bold text-foreground">Delivery instructions</h2>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={3}
          placeholder="Ring the bell once, leave at the door..."
          className="vino-card mt-2 w-full resize-none px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
        />
      </section>

      <section className="px-4 pt-6">
        <Link to="/coupons" className="vino-card flex items-center gap-3 px-4 py-3">
          <span className="grid size-9 place-items-center rounded-full bg-secondary text-primary-deep">
            <Icon name="local_offer" className="text-lg" />
          </span>
          <span className="flex-1 text-sm font-bold text-foreground">
            {coupon ? `${coupon.code} · saving ${inr(bill.discount)}` : "Apply a coupon"}
          </span>
          <Icon name="chevron_right" className="text-muted-foreground" />
        </Link>
      </section>

      <div className="pt-6">
        <BillDetails />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-border/60 bg-card/95 px-4 pt-3 pb-5 backdrop-blur">
        <Link to="/payment" className="vino-cta vino-cta-press">
          CONTINUE TO PAYMENT · {inr(bill.total)}
        </Link>
      </div>
    </Screen>
  );
}
