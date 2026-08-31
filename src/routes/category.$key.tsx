import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BottomNav } from "@/components/vino/BottomNav";
import { ProductCard } from "@/components/vino/ProductCard";
import { Chip, EmptyState, Icon, Screen, TopBar } from "@/components/vino/ui";
import { byCategory, categories, inr, type CategoryKey } from "@/lib/vino-data";
import { useVino } from "@/lib/vino-store";

const titles: Record<CategoryKey, { title: string; subtitle: string }> = {
  restaurant: { title: "Restaurant", subtitle: "Biryani, meals & curries cooked to order" },
  bakery: { title: "Bakery", subtitle: "Freshly baked favourites" },
  tea: { title: "Tea & Beverages", subtitle: "Brewed fresh, served with love" },
};

export const Route = createFileRoute("/category/$key")({
  validateSearch: (s: Record<string, unknown>) => ({
    sub: typeof s.sub === "string" ? s.sub : undefined,
  }),
  head: ({ params }) => {
    const key = (params.key as CategoryKey) in titles ? (params.key as CategoryKey) : "restaurant";
    const meta = titles[key];
    const cat = categories.find((c) => c.key === key);
    return {
      meta: [
        { title: `${meta.title} menu — Vino Tasty Hub` },
        { name: "description", content: `${meta.subtitle}. Order from the Vino Tasty Hub ${meta.title.toLowerCase()} menu.` },
        { property: "og:title", content: `${meta.title} menu — Vino Tasty Hub` },
        { property: "og:description", content: meta.subtitle },
        ...(cat
          ? [
              { property: "og:image", content: cat.image },
              { name: "twitter:image", content: cat.image },
            ]
          : []),
      ],
    };
  },
  component: CategoryMenu,
});

const sortOptions = ["Popular", "Price: low to high", "Rating"] as const;

function CategoryMenu() {
  const { key } = Route.useParams();
  const { sub } = Route.useSearch();
  const catKey = (key in titles ? key : "restaurant") as CategoryKey;
  const meta = titles[catKey];
  const cat = categories.find((c) => c.key === catKey)!;
  const { bill } = useVino();

  const [activeSub, setActiveSub] = useState<string | undefined>(sub);
  const [sort, setSort] = useState<(typeof sortOptions)[number]>("Popular");
  const [vegOnly, setVegOnly] = useState(false);
  const [bestseller, setBestseller] = useState(false);

  let list = byCategory(catKey);
  if (activeSub) list = list.filter((p) => p.sub === activeSub);
  if (vegOnly) list = list.filter((p) => p.veg);
  if (bestseller) list = list.filter((p) => !!p.badge);
  list = [...list].sort((a, b) =>
    sort === "Price: low to high"
      ? a.price - b.price
      : sort === "Rating"
        ? b.rating - a.rating
        : b.reviews - a.reviews,
  );

  return (
    <Screen>
      <TopBar
        title={meta.title}
        subtitle={meta.subtitle}
        back="/categories"
        right={
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative grid size-9 place-items-center rounded-full bg-muted text-primary-deep"
          >
            <Icon name="shopping_bag" className="text-xl" />
            {bill.count > 0 ? (
              <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {bill.count}
              </span>
            ) : null}
          </Link>
        }
      />

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
        <Chip
          label={sort}
          icon="swap_vert"
          active
          onClick={() =>
            setSort(sortOptions[(sortOptions.indexOf(sort) + 1) % sortOptions.length]!)
          }
        />
        <Chip label="Veg only" icon="eco" active={vegOnly} onClick={() => setVegOnly(!vegOnly)} />
        <Chip
          label="Bestseller"
          icon="local_fire_department"
          active={bestseller}
          onClick={() => setBestseller(!bestseller)}
        />
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
        <Chip label="All" active={!activeSub} onClick={() => setActiveSub(undefined)} />
        {cat.subs.map((s) => (
          <Chip
            key={s}
            label={s}
            active={activeSub === s}
            onClick={() => setActiveSub(activeSub === s ? undefined : s)}
          />
        ))}
      </div>

      {list.length ? (
        <div className="flex flex-col gap-3 px-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="ramen_dining"
          title="Nothing here yet"
          text="Try removing a filter to see more dishes."
        />
      )}

      {bill.count > 0 ? (
        <div className="fixed inset-x-0 bottom-20 z-40 mx-auto max-w-md px-4">
          <Link to="/cart" className="vino-cta vino-cta-press">
            <Icon name="shopping_bag" className="text-lg" />
            {bill.count} item{bill.count > 1 ? "s" : ""} · {inr(bill.itemTotal)} — VIEW CART
          </Link>
        </div>
      ) : null}

      <BottomNav />
    </Screen>
  );
}
