import { createFileRoute, Link } from "@tanstack/react-router";
import { Icon, Screen } from "@/components/vino/ui";

export const Route = createFileRoute("/order-success")({
  head: () => ({
    meta: [
      { title: "Order confirmed — Vino Tasty Hub" },
      { name: "description", content: "Your Vino Tasty Hub order is confirmed and being prepared." },
      { property: "og:title", content: "Order confirmed — Vino Tasty Hub" },
      { property: "og:description", content: "Track your order from kitchen to doorstep." },
    ],
  }),
  component: OrderSuccess,
});

function OrderSuccess() {
  return (
    <Screen padBottom={false}>
      <div className="flex min-h-screen flex-col items-center justify-center px-8 text-center">
        <span className="grid size-24 place-items-center rounded-full bg-success/15">
          <Icon name="check_circle" filled className="text-6xl text-success" />
        </span>
        <h1 className="mt-6 text-2xl font-extrabold text-foreground">Order confirmed!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Order <span className="font-bold text-foreground">#VH1045</span> is with our kitchen. We'll
          have it at your door in about 30 minutes.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3">
          <Link to="/track/$id" params={{ id: "VH1045" }} className="vino-cta vino-cta-press">
            TRACK ORDER
          </Link>
          <Link
            to="/home"
            className="rounded-full border border-border px-6 py-3 text-sm font-bold text-foreground"
          >
            Back to home
          </Link>
        </div>
      </div>
    </Screen>
  );
}
