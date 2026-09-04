import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Icon, Screen, TopBar } from "@/components/vino/ui";
import { getProduct, inr } from "@/lib/vino-data";
import { img } from "@/lib/vino-images";
import { useVino } from "@/lib/vino-store";

export const Route = createFileRoute("/track/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Tracking order ${params.id} — Vino Tasty Hub` },
      {
        name: "description",
        content: "Live status of your Vino Tasty Hub delivery, rider and ETA.",
      },
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

const cancelReasons = [
  "Ordered by mistake",
  "Wrong address",
  "Want to change items",
  "Delivery taking too long",
  "Other",
];

function Track() {
  const { id } = Route.useParams();
  const search = useSearch({ strict: false }) as { cancel?: string };
  const { orders, cancelOrder } = useVino();

  const order = orders.find((o) => o.id === id) ?? orders[0]!;
  const isCancelled = order.status === "cancelled";

  // Stage 0 = Confirmed, 1 = Preparing, 2 = Out for delivery, 3 = Delivered
  const [stage, setStage] = useState<number>(order.status === "delivered" ? 3 : 1);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(search?.cancel === "true");
  const [selectedReason, setSelectedReason] = useState<string>("Ordered by mistake");

  useEffect(() => {
    if (isCancelled || stage >= 3) return;
    const t = setInterval(() => {
      setStage((s) => (s < 3 ? s + 1 : s));
    }, 10000);
    return () => clearInterval(t);
  }, [isCancelled, stage]);

  // Cancellation rule: Allowed only during initial stages (stage 0 or 1, i.e., Order Confirmed / Preparing)
  const canCancel = !isCancelled && stage <= 1;

  const handleConfirmCancel = () => {
    cancelOrder(order.id, selectedReason);
    toast.success(`Order #${order.id} has been cancelled`);
    setShowCancelModal(false);
  };

  return (
    <Screen padBottom={false}>
      <TopBar
        title={`Order #${order.id}`}
        subtitle={isCancelled ? "Cancelled" : stage === 3 ? "Delivered" : "Arriving in ~25 min"}
        back="/orders"
      />

      {/* Map Banner or Cancelled Banner */}
      <div className="px-4 pt-4">
        {isCancelled ? (
          <div className="vino-card flex flex-col items-center gap-2 p-5 text-center border-destructive/30 bg-destructive/5">
            <span className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
              <Icon name="cancel" className="text-2xl" />
            </span>
            <h2 className="text-base font-bold text-destructive">Order Cancelled</h2>
            <p className="text-xs text-muted-foreground max-w-xs">
              {order.cancellationReason
                ? `Reason: ${order.cancellationReason}`
                : "This order was cancelled."}
            </p>
            <p className="text-[11px] font-semibold text-muted-foreground mt-1">
              {order.paymentMethod === "cod"
                ? "No payment refund is required."
                : `Refund of ${inr(order.total)} will be processed to your original payment method.`}
            </p>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-3xl shadow-sm">
            <img
              src={img.deliveryMap}
              alt="Live delivery map"
              className="h-48 w-full object-cover"
            />
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-card/95 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-foreground shadow-xs border border-border/60">
              <Icon
                name="delivery_dining"
                className="mr-1 align-middle text-base text-primary-deep"
              />
              {stage >= 2 ? "Rider on the way · 1.2 km" : "Restaurant preparing items"}
            </span>
          </div>
        )}
      </div>

      {/* Rider Info (Active orders) */}
      {!isCancelled && stage >= 1 && (
        <div className="px-4 pt-4">
          <div className="vino-card flex items-center gap-3 p-4">
            <img
              src={img.riderPhoto}
              alt="Delivery partner"
              className="size-12 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">
                {stage >= 2 ? "Rahul is on the way" : "Kitchen is preparing your order"}
              </p>
              <p className="text-[11px] text-muted-foreground">Delivery Partner · 4.9 ★</p>
            </div>
            <a
              href="tel:+919847012345"
              aria-label="Call delivery partner"
              className="grid size-10 place-items-center rounded-full bg-secondary text-primary-deep active:scale-95 transition-transform"
            >
              <Icon name="call" className="text-lg" />
            </a>
          </div>
        </div>
      )}

      {/* Order Status Progress */}
      <section className="px-4 pt-5">
        <h2 className="text-[15px] font-bold text-foreground mb-2.5">Order status</h2>
        <ol className="vino-card p-4">
          {steps.map((s, i) => {
            const done = !isCancelled && i <= stage;
            const isCurrent = !isCancelled && i === stage;
            return (
              <li key={s.title} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`grid size-9 place-items-center rounded-full transition-colors ${
                      isCancelled
                        ? "bg-muted text-muted-foreground"
                        : done
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <Icon name={s.icon} className="text-lg" />
                  </span>
                  {i < steps.length - 1 ? (
                    <span
                      className={`w-0.5 flex-1 ${
                        !isCancelled && i < stage ? "bg-primary" : "bg-border/60"
                      }`}
                    />
                  ) : null}
                </div>
                <div className={`pb-6 ${i === steps.length - 1 ? "pb-0" : ""}`}>
                  <p
                    className={`text-sm font-bold flex items-center gap-1.5 ${
                      done ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s.title}
                    {isCurrent ? (
                      <span className="size-2 rounded-full bg-primary animate-ping" />
                    ) : null}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{s.text}</p>
                </div>
              </li>
            );
          })}
        </ol>

        {/* CANCEL ORDER ACTION BUTTON (Visible only when cancellation is allowed) */}
        {canCancel && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="w-full rounded-2xl border border-destructive/40 bg-destructive/5 py-3.5 text-sm font-bold text-destructive hover:bg-destructive/10 transition-colors active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Icon name="cancel" className="text-lg" />
              CANCEL ORDER
            </button>
          </div>
        )}

        {/* Support Link Action */}
        <div className="mt-4 flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-muted-foreground">Need help with order?</span>
          <Link
            to="/help"
            className="text-xs font-bold text-primary-deep flex items-center gap-1 hover:underline"
          >
            <Icon name="support_agent" className="text-base" />
            CONTACT SUPPORT
          </Link>
        </div>
      </section>

      {/* Items in this order */}
      <section className="px-4 pt-6 pb-12">
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

      {/* CANCEL ORDER CONFIRMATION BOTTOM SHEET */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-card rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl animate-in slide-in-from-bottom duration-300 border border-border"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">Cancel this order?</h3>
                <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                  Please tell us why.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="grid size-8 place-items-center rounded-full bg-muted text-muted-foreground hover:text-foreground active:scale-95"
              >
                <Icon name="close" className="text-lg" />
              </button>
            </div>

            {/* Reasons Selection */}
            <div className="mt-4 flex flex-col gap-2">
              {cancelReasons.map((reason) => {
                const selected = selectedReason === reason;
                return (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setSelectedReason(reason)}
                    className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                      selected
                        ? "border-primary bg-secondary/60 text-foreground font-semibold shadow-xs"
                        : "border-border/80 bg-background/50 text-foreground/80 hover:border-primary/40"
                    }`}
                  >
                    <div
                      className={`size-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selected ? "border-primary" : "border-muted-foreground/40"
                      }`}
                    >
                      {selected && <div className="size-2 rounded-full bg-primary" />}
                    </div>
                    <span className="text-sm font-semibold">{reason}</span>
                  </button>
                );
              })}
            </div>

            {/* Refund Information */}
            <div className="mt-4 rounded-2xl border border-border/80 bg-muted/40 p-3.5 text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between font-bold text-foreground text-sm">
                <span>Refund amount:</span>
                <span>{inr(order.total)}</span>
              </div>
              <p className="text-[11px] leading-relaxed pt-0.5">
                {order.paymentMethod === "cod"
                  ? "No payment refund is required."
                  : "Refund will be processed to your original payment method."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="w-full rounded-full border border-border py-3 text-sm font-bold text-foreground hover:bg-muted active:scale-[0.99] transition-colors"
              >
                KEEP ORDER
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={!selectedReason}
                className="w-full rounded-full bg-destructive py-3 text-sm font-bold text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 active:scale-[0.99] transition-colors shadow-xs"
              >
                CANCEL ORDER
              </button>
            </div>
          </div>
        </div>
      )}
    </Screen>
  );
}
