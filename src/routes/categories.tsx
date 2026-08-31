import { createFileRoute, Link } from "@tanstack/react-router";
import { BottomNav } from "@/components/vino/BottomNav";
import { Icon, Screen, TopBar } from "@/components/vino/ui";
import { categories } from "@/lib/vino-data";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Vino Tasty Hub" },
      {
        name: "description",
        content:
          "Explore Vino Tasty Hub categories: restaurant biryani and meals, bakery cakes and puffs, tea and beverages.",
      },
      { property: "og:title", content: "Categories — Vino Tasty Hub" },
      {
        property: "og:description",
        content: "Restaurant, bakery and tea menus with quick subcategory filters.",
      },
    ],
  }),
  component: Categories,
});

function Categories() {
  return (
    <Screen>
      <TopBar
        title="Categories"
        subtitle="Pick a counter to start ordering"
        right={
          <Link
            to="/search"
            aria-label="Search"
            className="grid size-9 place-items-center rounded-full bg-muted text-primary-deep"
          >
            <Icon name="search" className="text-xl" />
          </Link>
        }
      />

      <div className="flex flex-col gap-5 px-4 pt-4">
        {categories.map((c) => (
          <section key={c.key} className="vino-card overflow-hidden">
            <Link to="/category/$key" params={{ key: c.key }} className="relative block">
              <img src={c.image} alt={c.title} className="h-36 w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-card">{c.title}</h2>
                  <p className="text-[11px] text-card/80">{c.subtitle}</p>
                </div>
                <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Icon name="arrow_forward" className="text-lg" />
                </span>
              </div>
            </Link>
            <div className="flex flex-wrap gap-2 p-3">
              {c.subs.map((s) => (
                <Link
                  key={s}
                  to="/category/$key"
                  params={{ key: c.key }}
                  search={{ sub: s }}
                  className="vino-chip"
                >
                  {s}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <BottomNav />
    </Screen>
  );
}
