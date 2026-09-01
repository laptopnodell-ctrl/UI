import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Icon, Screen, TopBar } from "@/components/vino/ui";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & support — Vino Tasty Hub" },
      { name: "description", content: "Get help with orders, refunds and delivery from Vino Tasty Hub support." },
      { property: "og:title", content: "Help & support — Vino Tasty Hub" },
      { property: "og:description", content: "FAQs, chat and call support for your order." },
    ],
  }),
  component: Help,
});

const faqs = [
  {
    q: "How long does delivery take?",
    a: "Most orders reach you in 25-35 minutes depending on distance and kitchen load.",
  },
  {
    q: "Can I cancel my order?",
    a: "You can cancel free of charge until the kitchen starts preparing your food.",
  },
  {
    q: "How do refunds work?",
    a: "Refunds are issued to your original payment method within 3-5 working days.",
  },
  {
    q: "Do you deliver bakery items same day?",
    a: "Yes. Cakes ordered before 6 PM are delivered the same day; custom cakes need 24 hours.",
  },
];

function Help() {
  const [open, setOpen] = useState<string | null>(faqs[0]?.q ?? null);

  return (
    <Screen padBottom={false}>
      <TopBar title="Help & Support" back="/profile" />

      <div className="grid grid-cols-2 gap-3 px-4 pt-4">
        <a
          href="tel:+919847012345"
          className="vino-card flex flex-col items-center gap-2 p-4 text-center"
        >
          <Icon name="call" className="text-2xl text-primary-deep" />
          <span className="text-sm font-bold text-foreground">Call us</span>
          <span className="text-[11px] text-muted-foreground">9 AM - 11 PM</span>
        </a>
        <button
          type="button"
          onClick={() => toast.success("A support agent will join shortly")}
          className="vino-card flex flex-col items-center gap-2 p-4 text-center"
        >
          <Icon name="chat_bubble" className="text-2xl text-primary-deep" />
          <span className="text-sm font-bold text-foreground">Live chat</span>
          <span className="text-[11px] text-muted-foreground">Avg reply 2 min</span>
        </button>
      </div>

      <section className="px-4 pt-6 pb-10">
        <h2 className="text-[15px] font-bold text-foreground">Frequently asked</h2>
        <div className="vino-card mt-2 divide-y divide-border">
          {faqs.map((f) => {
            const isOpen = open === f.q;
            return (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : f.q)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  <span className="flex-1 text-sm font-bold text-foreground">{f.q}</span>
                  <Icon
                    name={isOpen ? "expand_less" : "expand_more"}
                    className="text-muted-foreground"
                  />
                </button>
                {isOpen ? (
                  <p className="px-4 pb-4 text-xs leading-relaxed text-muted-foreground">{f.a}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </Screen>
  );
}
