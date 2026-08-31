import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { EmptyState, Icon, Screen, TopBar } from "@/components/vino/ui";
import { useVino } from "@/lib/vino-store";

export const Route = createFileRoute("/addresses")({
  head: () => ({
    meta: [
      { title: "Delivery address — Vino Tasty Hub" },
      { name: "description", content: "Choose or add a delivery address for your Vino Tasty Hub order." },
      { property: "og:title", content: "Delivery address — Vino Tasty Hub" },
      { property: "og:description", content: "Manage your saved home, work and other addresses." },
    ],
  }),
  component: Addresses,
});

const icons = { Home: "home", Work: "work", Other: "location_on" } as const;

function Addresses() {
  const { addresses, selectedAddressId, selectAddress, removeAddress } = useVino();

  return (
    <Screen>
      <TopBar title="Delivery Address" back="/checkout" />

      {addresses.length ? (
        <div className="flex flex-col gap-3 px-4 pt-4">
          {addresses.map((a) => {
            const active = a.id === selectedAddressId;
            return (
              <article
                key={a.id}
                className={`vino-card p-4 ${active ? "border-primary" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => selectAddress(a.id)}
                  className="flex w-full items-start gap-3 text-left"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-primary-deep">
                    <Icon name={icons[a.label]} className="text-lg" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-foreground">{a.label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {a.line1}, {a.line2}, {a.city} {a.pin}
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-muted-foreground">
                      {a.name} · {a.phone}
                    </span>
                  </span>
                  <Icon
                    name={active ? "check_circle" : "radio_button_unchecked"}
                    filled={active}
                    className={`text-xl ${active ? "text-primary" : "text-muted-foreground"}`}
                  />
                </button>
                <div className="mt-3 flex gap-4 border-t border-border pt-3">
                  <Link
                    to="/addresses/new"
                    className="text-xs font-bold text-primary-deep"
                  >
                    EDIT
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      removeAddress(a.id);
                      toast.success("Address removed");
                    }}
                    className="text-xs font-bold text-destructive"
                  >
                    DELETE
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon="location_off"
          title="No saved addresses"
          text="Add a delivery address so we know where to bring your food."
          ctaLabel="ADD NEW ADDRESS"
          ctaTo="/addresses/new"
        />
      )}

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-border/60 bg-card/95 px-4 pt-3 pb-5 backdrop-blur">
        <Link to="/addresses/new" className="vino-cta vino-cta-press">
          <Icon name="add" className="text-lg" /> ADD NEW ADDRESS
        </Link>
      </div>
    </Screen>
  );
}
