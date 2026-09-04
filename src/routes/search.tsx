import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BottomNav } from "@/components/vino/BottomNav";
import { ProductCard } from "@/components/vino/ProductCard";
import { Chip, EmptyState, Icon, Screen } from "@/components/vino/ui";
import { categories, popularSearches, products, recentSearches } from "@/lib/vino-data";
import { img } from "@/lib/vino-images";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search the menu — Vino Tasty Hub" },
      {
        name: "description",
        content: "Search biryani, cakes, puffs, tea and more across the Vino Tasty Hub menu.",
      },
      { property: "og:title", content: "Search the menu — Vino Tasty Hub" },
      { property: "og:description", content: "Find your favourite dish in seconds." },
    ],
  }),
  component: Search,
});

function Search() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string | null>(null);

  const term = q.trim().toLowerCase();
  let results = term
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.sub.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term),
      )
    : [];
  if (filter) results = results.filter((p) => p.category === filter);

  return (
    <Screen>
      <header className="vino-surface-sticky sticky top-0 z-30 border-b border-border/60 h-[60px] flex items-center px-4">
        <div className="flex w-full items-center gap-2.5">
          <Link
            to="/home"
            aria-label="Go back"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-card border border-border/80 text-foreground shadow-2xs hover:bg-secondary transition-all active:scale-95"
          >
            <Icon name="arrow_back" className="text-xl" />
          </Link>
          <img
            src={img.logo}
            alt="Vino"
            className="h-8 w-auto object-contain mix-blend-multiply shrink-0"
          />
          <div className="vino-card flex flex-1 items-center gap-2 px-3 py-1.5 rounded-[14px]">
            <Icon name="search" className="text-lg text-primary-deep" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search biryani, cakes, tea..."
              className="flex-1 bg-transparent text-sm font-semibold outline-none placeholder:font-normal placeholder:text-muted-foreground"
            />
            {q ? (
              <button type="button" aria-label="Clear search" onClick={() => setQ("")}>
                <Icon name="close" className="text-lg text-muted-foreground" />
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {!term ? (
        <div className="px-4 pt-5">
          <h2 className="text-sm font-bold text-foreground">Recent searches</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {recentSearches.map((r) => (
              <Chip key={r} label={r} icon="history" onClick={() => setQ(r)} />
            ))}
          </div>

          <h2 className="mt-6 text-sm font-bold text-foreground">Popular searches</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {popularSearches.map((r) => (
              <Chip key={r} label={r} icon="trending_up" onClick={() => setQ(r)} />
            ))}
          </div>

          <h2 className="mt-6 text-sm font-bold text-foreground">Suggested categories</h2>
          <div className="mt-2 grid grid-cols-3 gap-3">
            {categories.map((c) => (
              <Link
                key={c.key}
                to="/category/$key"
                params={{ key: c.key }}
                className="vino-card overflow-hidden"
              >
                <img src={c.image} alt={c.title} className="h-16 w-full object-cover" />
                <p className="p-2 text-[11px] font-bold text-foreground">{c.title}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
            <Chip label="All" active={!filter} onClick={() => setFilter(null)} />
            {categories.map((c) => (
              <Chip
                key={c.key}
                label={c.title}
                active={filter === c.key}
                onClick={() => setFilter(filter === c.key ? null : c.key)}
              />
            ))}
          </div>

          {results.length ? (
            <div className="flex flex-col gap-3 px-4">
              <p className="text-xs font-semibold text-muted-foreground">
                {results.length} result{results.length > 1 ? "s" : ""} for “{q}”
              </p>
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="search_off"
              title="No tasty matches found."
              text="Try searching for something else."
            />
          )}
        </>
      )}

      <BottomNav />
    </Screen>
  );
}
