import { inr } from "@/lib/vino-data";
import { useVino } from "@/lib/vino-store";

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
