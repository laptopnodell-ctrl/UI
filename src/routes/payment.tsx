import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Icon, Screen, StickyBar, TopBar } from "@/components/vino/ui";
import { inr } from "@/lib/vino-data";
import { useVino } from "@/lib/vino-store";

export const Route = createFileRoute("/payment")({
  head: () => ({
    meta: [
      { title: "Payment — Vino Tasty Hub" },
      { name: "description", content: "Pay by UPI, card, wallet or cash on delivery for your order." },
      { property: "og:title", content: "Payment — Vino Tasty Hub" },
      { property: "og:description", content: "Secure payment options for your Vino Tasty Hub order." },
    ],
  }),
  component: Payment,
});

const methods = [
  { id: "upi", icon: "account_balance", label: "UPI", detail: "GPay, PhonePe, Paytm" },
  { id: "card", icon: "credit_card", label: "Credit / Debit card", detail: "Visa, Mastercard, RuPay" },
  { id: "wallet", icon: "wallet", label: "Vino Wallet", detail: "Balance ₹250" },
  { id: "cod", icon: "payments", label: "Cash on delivery", detail: "Pay when it arrives" },
];

function Payment() {
  const { bill, clearCart, applyCoupon } = useVino();
  const [method, setMethod] = useState("upi");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const pay = () => {
    setBusy(true);
    setTimeout(() => {
      clearCart();
      applyCoupon(null);
      toast.success("Order placed!");
      navigate({ to: "/order-success" });
    }, 1200);
  };

  return (
    <Screen>
      <TopBar title="Payment" subtitle={`Paying ${inr(bill.total)}`} back="/checkout" />

      <div className="flex flex-col gap-3 px-4 pt-4">
        {methods.map((m) => {
          const active = m.id === method;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className={`vino-card flex items-center gap-3 p-4 text-left ${active ? "border-primary" : ""}`}
            >
              <span className="grid size-10 place-items-center rounded-full bg-secondary text-primary-deep">
                <Icon name={m.icon} className="text-lg" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-bold text-foreground">{m.label}</span>
                <span className="block text-[11px] text-muted-foreground">{m.detail}</span>
              </span>
              <Icon
                name={active ? "radio_button_checked" : "radio_button_unchecked"}
                className={`text-xl ${active ? "text-primary" : "text-muted-foreground"}`}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-6 px-4">
        <div className="vino-card flex items-center gap-2 px-4 py-3">
          <Icon name="lock" className="text-base text-success" />
          <p className="text-[11px] text-muted-foreground">
            Payments are encrypted and processed securely. This demo does not charge you.
          </p>
        </div>
      </div>

      <StickyBar>
        <button type="button" onClick={pay} disabled={busy} className="vino-cta vino-cta-press disabled:opacity-60">
          {busy ? "PROCESSING..." : `PAY ${inr(bill.total)}`}
        </button>
      </StickyBar>
    </Screen>
  );
}
