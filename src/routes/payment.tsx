import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Icon, Screen, StickyBar, TopBar } from "@/components/vino/ui";
import { inr } from "@/lib/vino-data";
import { useVino } from "@/lib/vino-store";

export const Route = createFileRoute("/payment")({
  head: () => ({
    meta: [
      { title: "Payment — Vino Tasty Hub" },
      {
        name: "description",
        content: "Pay by UPI, card, wallet or cash on delivery for your order.",
      },
      { property: "og:title", content: "Payment — Vino Tasty Hub" },
      {
        property: "og:description",
        content: "Secure payment options for your Vino Tasty Hub order.",
      },
    ],
  }),
  component: Payment,
});

const methods = [
  {
    id: "upi",
    icon: "qr_code_scanner",
    label: "UPI",
    detail: "Google Pay, PhonePe, Paytm & more",
  },
  {
    id: "cod",
    icon: "payments",
    label: "Cash on Delivery",
    detail: "Pay when your order arrives",
  },
  {
    id: "card",
    icon: "credit_card",
    label: "Credit / Debit Card",
    detail: "Visa, Mastercard, RuPay",
  },
  {
    id: "netbanking",
    icon: "account_balance",
    label: "Net Banking",
    detail: "Pay securely through your bank",
  },
  {
    id: "wallet",
    icon: "account_balance_wallet",
    label: "Wallet",
    detail: "Use supported mobile wallets",
  },
];

function Payment() {
  const { bill, clearCart, applyCoupon } = useVino();
  const [method, setMethod] = useState("upi");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const displayTotal = bill.total > 0 ? bill.total : 370;

  const pay = () => {
    setBusy(true);
    setTimeout(() => {
      clearCart();
      applyCoupon(null);
      toast.success(method === "cod" ? "Order placed successfully!" : "Payment successful!");
      navigate({ to: "/order-success" });
    }, 1500);
  };

  return (
    <Screen>
      <TopBar title="Payment Method" back="/checkout" />

      {/* Title Subheader */}
      <div className="px-4 pt-4 pb-1">
        <h2 className="text-lg font-bold text-foreground">Select your payment method</h2>
        <p className="text-xs font-semibold text-muted-foreground mt-0.5">
          Choose how you'd like to pay
        </p>
      </div>

      {/* Payment Options List */}
      <div className="flex flex-col gap-3 px-4 pt-3">
        {methods.map((m) => {
          const active = m.id === method;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className={`vino-card flex items-center gap-4 p-4 text-left cursor-pointer transition-all active:scale-[0.99] ${
                active
                  ? "border-primary shadow-sm bg-secondary/30"
                  : "border-border/80 hover:border-primary/40"
              }`}
            >
              <div
                className={`grid size-10 place-items-center rounded-xl transition-colors ${
                  active ? "bg-primary/15 text-primary-deep" : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon name={m.icon} className="text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">{m.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{m.detail}</p>
              </div>
              <div
                className={`size-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  active ? "border-primary" : "border-muted-foreground/40"
                }`}
              >
                {active ? (
                  <div className="size-2.5 rounded-full bg-primary animate-in zoom-in-50 duration-150" />
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      {/* Security Note */}
      <div className="mt-6 px-4">
        <div className="vino-card flex items-center gap-2.5 px-4 py-3 bg-card/60">
          <Icon name="lock" className="text-base text-success" />
          <p className="text-[11px] text-muted-foreground leading-tight">
            Payments are 256-bit SSL encrypted & secure. Demo mode — no real money charged.
          </p>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <StickyBar>
        <div className="flex items-center justify-between px-1 mb-3">
          <span className="text-sm font-semibold text-muted-foreground">Total Amount</span>
          <span className="text-lg font-extrabold text-foreground">{inr(displayTotal)}</span>
        </div>
        <button
          type="button"
          onClick={pay}
          disabled={busy}
          className="vino-cta vino-cta-press w-full py-3.5 text-base font-bold flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {busy ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              <span>PROCESSING...</span>
            </>
          ) : (
            <>
              <span>{method === "cod" ? "PLACE ORDER" : `PAY ${inr(displayTotal)}`}</span>
              <Icon name={method === "cod" ? "arrow_forward" : "lock"} className="text-lg" />
            </>
          )}
        </button>
      </StickyBar>
    </Screen>
  );
}
