import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Icon, Screen, TopBar } from "@/components/vino/ui";
import { coupons, inr } from "@/lib/vino-data";
import { useVino } from "@/lib/vino-store";

export const Route = createFileRoute("/coupons")({
  head: () => ({
    meta: [
      { title: "Coupons & offers — Vino Tasty Hub" },
      { name: "description", content: "Apply Vino Tasty Hub coupons and save on your food order." },
      { property: "og:title", content: "Coupons & offers — Vino Tasty Hub" },
      { property: "og:description", content: "Flat discounts on biryani, cakes and tea." },
    ],
  }),
  component: Coupons,
});

function Coupons() {
  const { applyCoupon, couponCode, bill } = useVino();
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const apply = (c: string) => {
    const found = coupons.find((x) => x.code.toLowerCase() === c.trim().toLowerCase());
    if (!found) {
      toast.error("Invalid coupon code");
      return;
    }
    if (bill.itemTotal < found.minOrder) {
      toast.error(`Add items worth ${inr(found.minOrder - bill.itemTotal)} more`);
      return;
    }
    applyCoupon(found.code);
    toast.success(`${found.code} applied — you saved ${inr(found.discount)}`);
    navigate({ to: "/cart" });
  };

  return (
    <Screen padBottom={false}>
      <TopBar title="Apply Coupon" back="/cart" />

      <div className="px-4 pt-4">
        <div className="vino-card flex items-center gap-2 px-4 py-3">
          <Icon name="confirmation_number" className="text-lg text-primary-deep" />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="flex-1 bg-transparent text-sm font-bold tracking-wide outline-none placeholder:font-normal placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={() => apply(code)}
            className="text-sm font-bold text-primary-deep"
          >
            APPLY
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 px-4 pb-10">
        <h2 className="text-[15px] font-bold text-foreground">Available coupons</h2>
        {coupons.map((c) => {
          const active = couponCode === c.code;
          const eligible = bill.itemTotal >= c.minOrder;
          return (
            <article key={c.code} className={`vino-card p-4 ${active ? "border-primary" : ""}`}>
              <div className="flex items-center justify-between">
                <span className="rounded-lg border border-dashed border-primary bg-secondary px-2.5 py-1 text-xs font-extrabold tracking-wider text-secondary-foreground">
                  {c.code}
                </span>
                {active ? (
                  <button
                    type="button"
                    onClick={() => {
                      applyCoupon(null);
                      toast.success("Coupon removed");
                    }}
                    className="text-xs font-bold text-destructive"
                  >
                    REMOVE
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => apply(c.code)}
                    disabled={!eligible}
                    className="text-xs font-bold text-primary-deep disabled:text-muted-foreground"
                  >
                    APPLY
                  </button>
                )}
              </div>
              <p className="mt-2 text-sm font-bold text-foreground">{c.title}</p>
              <p className="text-xs text-muted-foreground">{c.detail}</p>
              {!eligible ? (
                <p className="mt-2 text-[11px] font-semibold text-destructive">
                  Add {inr(c.minOrder - bill.itemTotal)} more to use this coupon
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </Screen>
  );
}
