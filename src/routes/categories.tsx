import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BottomNav } from "@/components/vino/BottomNav";
import { Icon, Screen } from "@/components/vino/ui";
import { categories, inr, products } from "@/lib/vino-data";

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

const subCategoryIcons: Record<string, string> = {
  // Restaurant
  Biryani: "ramen_dining",
  Meals: "restaurant",
  Rice: "rice_bowl",
  Noodles: "ramen_dining",
  Chicken: "kebab_dining",
  Fish: "set_meal",
  Veg: "nutrition",
  Snacks: "tapas",

  // Bakery
  Cakes: "cake",
  Pastries: "bakery_dining",
  Puffs: "bakery_dining",
  Bread: "breakfast_dining",
  Cookies: "cookie",
  Sweets: "celebration",

  // Tea
  Tea: "local_cafe",
  Coffee: "coffee",
  "Fresh Juice": "local_bar",
  Milkshakes: "icecream",
  "Cold Drinks": "water_drop",
};

export function Categories() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filterOptions = [
    { key: "All", label: "All" },
    { key: "restaurant", label: "Restaurant" },
    { key: "bakery", label: "Bakery" },
    { key: "tea", label: "Tea" },
  ];

  const filteredCategories =
    activeFilter === "All"
      ? categories
      : categories.filter((c) => c.key === activeFilter);

  const trendingProducts = products.filter((p) =>
    ["chicken-biryani", "masala-chai", "black-forest-cake"].includes(p.id),
  );

  return (
    <Screen>
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 vino-surface-sticky border-b border-border/50 px-4 py-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Explore Vino</h1>
            <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
              What are you craving today?
            </p>
          </div>
          <Link
            to="/search"
            aria-label="Search menu"
            className="grid size-10 place-items-center rounded-full bg-card shadow-xs border border-border/60 text-primary-deep hover:bg-secondary transition-colors"
          >
            <Icon name="search" className="text-xl" />
          </Link>
        </div>
      </header>

      {/* Quick Filters */}
      <section className="px-4 pt-4">
        <div className="no-scrollbar flex overflow-x-auto gap-2.5 py-1">
          {filterOptions.map((f) => {
            const active = activeFilter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setActiveFilter(f.key)}
                className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                    : "bg-card text-foreground/80 border border-border/80 shadow-xs hover:border-primary/40"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Trending Now */}
      <section className="pt-5">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-1.5">
            Trending Now
            <Icon name="local_fire_department" filled className="text-primary text-lg" />
          </h2>
        </div>
        <div className="no-scrollbar flex overflow-x-auto gap-3 px-4 pb-1">
          {trendingProducts.map((item) => (
            <Link
              key={item.id}
              to="/product/$id"
              params={{ id: item.id }}
              className="flex items-center gap-3 bg-card p-2.5 rounded-2xl border border-border/80 shadow-xs min-w-[210px] shrink-0 hover:border-primary/50 transition-colors"
            >
              <img
                src={item.image}
                alt={item.name}
                className="size-14 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0 flex flex-col justify-center">
                <span className="font-bold text-xs text-foreground truncate">{item.name}</span>
                <span className="text-primary-deep font-extrabold text-sm mt-0.5">
                  {inr(item.price)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories List */}
      <div className="space-y-6 px-4 pt-5">
        {filteredCategories.map((c) => {
          const badge =
            c.key === "restaurant"
              ? "Popular"
              : c.key === "bakery"
                ? "Freshly baked"
                : "Refreshing";
          return (
            <section key={c.key} className="space-y-3">
              {/* Category Hero Banner */}
              <Link
                to="/category/$key"
                params={{ key: c.key }}
                className="group relative block h-52 rounded-3xl overflow-hidden shadow-md"
              >
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Badge */}
                <span className="absolute top-3.5 left-3.5 bg-primary/90 backdrop-blur-md text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  {badge}
                </span>

                {/* Banner Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end">
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-wide">{c.title}</h2>
                    <p className="text-white/80 text-xs mt-0.5 font-medium">{c.subtitle}</p>
                  </div>
                  <span className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <Icon name="arrow_forward" className="text-xl" />
                  </span>
                </div>
              </Link>

              {/* Subcategories Horizontal Icon List */}
              <div className="no-scrollbar flex overflow-x-auto gap-2.5 pb-1">
                {c.subs.map((sub) => {
                  const iconName = subCategoryIcons[sub] || "restaurant";
                  return (
                    <Link
                      key={sub}
                      to="/category/$key"
                      params={{ key: c.key }}
                      search={{ sub }}
                      className="flex flex-col items-center gap-1.5 bg-card px-3.5 py-3 rounded-2xl shadow-xs border border-border/80 min-w-[76px] hover:border-primary/40 transition-colors text-center shrink-0"
                    >
                      <Icon name={iconName} className="text-primary-deep text-2xl" />
                      <span className="text-[11px] font-bold text-foreground line-clamp-1">
                        {sub}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <BottomNav />
    </Screen>
  );
}
