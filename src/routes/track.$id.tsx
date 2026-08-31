import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Icon, Screen, TopBar } from "@/components/vino/ui";
import { getProduct, inr, pastOrders } from "@/lib/vino-data";
import { img } from "@/lib/vino-images";

export const Route = createFileRoute("/track/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Tracking order ${params.id} — Vino Tasty Hub` },
      { name: "description", content: "Live status of your Vino Tasty Hub delivery, rider and ETA." },
      { property: "og:title", content: `Tracking order ${params.id} — Vino Tasty Hub` },
      { property: "og:description", content: "Follow your food from the kitchen to your door." },
    ],
  }),
  component: Track,
});

const steps = [
  { icon: "receipt_long", title: "Order confirmed", text: "We received your order" },
  { icon: "skillet", title: "Preparing your food", text: "Our chefs are on it" },
  { icon: "delivery_dining", title: "Out for delivery", text: "Rider picked up your order" },
  { icon: "home", title: "Delivered", text: "Enjoy your meal!" },
];

function Track() {
  const { id } = Route.useParams();
  const order = pastOrders.find((o) => o.id === id) ?? pastOrders[0];
  const [stage, setStage] = useState(1);

  useEffect(() => {
    const t = setInterval(() => setStage((s) => (s < 3 ? s + 1 : s)), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <Screen padBottom={false}>
      <TopBar title={`Order #${order.id}`} subtitle="Arriving in ~25 min" back="/orders" />

      <div className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-3xl">
          <img src={img.deliveryMap} alt="Live delivery map" className="h-52 w-full object-cover" />
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-card px-4 py-1.5 text-xs font-bold text-foreground shadow-[var(--shadow-card)]">
            <Icon name="delivery_dining" className="mr-1 align-middle text-base text-primary-deep" />
            2.4 km away
          </span>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="vino-card flex items-center gap-3 p-4">
          <img src={img.riderPhoto} alt="Delivery partner" className="size-12 rounded-full object-cover" />
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">Rahul is on the way</p>
            <p className="text-[11px] text-muted-foreground">Your delivery partner · 4.9 ★</p>
          </div>
          <a
            href="tel:+919847012345"
            aria-label="Call delivery partner"
            className="grid size-10 place-items-center rounded-full bg-secondary text-primary-deep"
          >
            <Icon name="call" className="text-lg" />
          </a>
          <Link
            to="/help"
            aria-label="Chat with support"
            className="grid size-10 place-items-center rounded-full bg-secondary text-primary-deep"
          >
            <Icon name="chat_bubble" className="text-lg" />
          </Link>
        </div>
      </div>

      <section className="px-4 pt-6">
        <h2 className="text-[15px] font-bold text-foreground">Order status</h2>
        <ol className="vino-card mt-2 p-4">
          {steps.map((s, i) => {
            const done = i <= stage;
            return (
              <li key={s.title} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`grid size-9 place-items-center rounded-full ${
                      done ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <Icon name={s.icon} className="text-lg" />
                  </span>
                  {i < steps.length - 1 ? (
                    <span className={`w-0.5 flex-1 ${i < stage ? "bg-primary" : "bg-border"}`} />
                  ) : null}
                </div>
                <div className={`pb-6 ${i === steps.length - 1 ? "pb-0" : ""}`}>
                  <p className={`text-sm font-bold ${done ? "text-foreground" : "text-muted-foreground"}`}>
                    {s.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{s.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="px-4 pt-6 pb-10">
        <h2 className="text-[15px] font-bold text-foreground">Items in this order</h2>
        <div className="vino-card mt-2 divide-y divide-border">
          {order.items.map((it) => {
            const p = getProduct(it.productId);
            if (!p) return null;
            return (
              <div key={it.productId} className="flex items-center gap-3 p-3">
                <img src={p.image} alt={p.name} className="size-12 rounded-lg object-cover" />
                <p className="flex-1 text-sm font-bold text-foreground">{p.name}</p>
                <span className="text-xs font-semibold text-muted-foreground">x{it.qty}</span>
              </div>
            );
          })}
          <div className="flex items-center justify-between p-3">
            <span className="text-sm font-bold text-foreground">Total paid</span>
            <span className="text-sm font-extrabold text-foreground">{inr(order.total)}</span>
          </div>
        </div>
      </section>
    </Screen>
  );
}
