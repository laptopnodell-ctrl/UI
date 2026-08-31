import { createFileRoute, Link } from "@tanstack/react-router";
import { BottomNav } from "@/components/vino/BottomNav";
import { ProductCard, ProductTile } from "@/components/vino/ProductCard";
import { Icon, Screen, SectionTitle } from "@/components/vino/ui";
import { categories, offers, popularPicks, recommended } from "@/lib/vino-data";
import { img } from "@/lib/vino-images";
import { useVino } from "@/lib/vino-store";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Order food — Vino Tasty Hub Kochi" },
      {
        name: "description",
        content:
          "Browse popular picks, today's offers and recommended dishes from Vino Tasty Hub's restaurant, bakery and tea counters.",
      },
      { property: "og:title", content: "Order food — Vino Tasty Hub Kochi" },
      {
        property: "og:description",
        content: "Popular biryani, fresh cakes and hot tea delivered from Vino Tasty Hub.",
      },
      { property: "og:image", content: img.heroBiryani },
      { name: "twitter:image", content: img.heroBiryani },
    ],
  }),
  component: Home,
});

function Home() {
  const { bill } = useVino();

  return (
    <Screen>
      <header className="vino-surface-sticky sticky top-0 z-30 border-b border-border/60">
        <div className="flex items-center justify-between px-4 py-3">
          <img src={img.logo} alt="Vino Tasty Hub" className="h-8 w-auto object-contain" />
          <div className="flex items-center gap-1">
            <Link
              to="/notifications"
              aria-label="Notifications"
              className="grid size-9 place-items-center rounded-full text-primary-deep"
            >
              <Icon name="notifications" className="text-2xl" />
            </Link>
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative grid size-9 place-items-center rounded-full text-primary-deep"
            >
              <Icon name="shopping_bag" className="text-2xl" />
              {bill.count > 0 ? (
                <span className="absolute top-0 right-0 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {bill.count}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </header>

      <section className="px-4 pt-4">
        <p className="text-sm font-semibold text-muted-foreground">Good evening, Arjun</p>
        <Link
          to="/addresses"
          className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 shadow-[var(--shadow-card)]"
        >
          <Icon name="location_on" filled className="text-base text-primary" />
          <span className="text-xs font-bold text-foreground">Deliver to Home, Kochi</span>
          <Icon name="expand_more" className="text-sm text-muted-foreground" />
        </Link>

        <Link
          to="/search"
          className="vino-card mt-3 flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground"
        >
          <Icon name="search" className="text-xl text-primary-deep" />
          Search biryani, cakes, tea...
        </Link>
      </section>

      <section className="px-4 pt-5">
        <Link to="/category/$key" params={{ key: "restaurant" }} className="relative block">
          <img
            src={img.heroBiryani}
            alt="Chicken biryani served in an earthen pot"
            className="h-44 w-full rounded-3xl object-cover"
          />
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-foreground/70 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-xs font-bold tracking-wide text-primary uppercase">Today's hero</p>
            <h2 className="mt-1 text-xl font-extrabold text-card">Dum Biryani, straight from the pot</h2>
            <span className="mt-2 inline-flex rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground">
              Order now · 30 mins
            </span>
          </div>
        </Link>
      </section>

      <section className="pt-6">
        <SectionTitle title="Explore Vino" action="See all" to="/categories" />
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
          {categories.map((c) => (
            <Link
              key={c.key}
              to="/category/$key"
              params={{ key: c.key }}
              className="vino-card w-36 shrink-0 overflow-hidden"
            >
              <img src={c.image} alt={c.title} className="h-24 w-full object-cover" />
              <div className="p-3">
                <p className="text-sm font-bold text-foreground">{c.title}</p>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">{c.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="pt-6">
        <SectionTitle title="Popular Picks" action="See all" to="/category/restaurant" />
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
          {popularPicks.map((p) => (
            <ProductTile key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="pt-6">
        <SectionTitle title="Today's Offers" action="All offers" to="/offers" />
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
          {offers.map((o) => (
            <Link
              key={o.id}
              to="/offers"
              className="vino-card flex w-64 shrink-0 items-center gap-3 p-3"
            >
              <img src={o.image} alt={o.title} className="size-16 rounded-xl object-cover" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground">{o.title}</p>
                <p className="truncate text-[11px] text-muted-foreground">{o.detail}</p>
                <span className="mt-1 inline-flex rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground">
                  {o.code}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="pt-6">
        <SectionTitle title="Recommended for you" />
        <div className="flex flex-col gap-3 px-4">
          {recommended.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <BottomNav />
    </Screen>
  );
}
