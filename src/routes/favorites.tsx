import { createFileRoute } from "@tanstack/react-router";
import { BottomNav } from "@/components/vino/BottomNav";
import { ProductCard } from "@/components/vino/ProductCard";
import { EmptyState, Screen, TopBar } from "@/components/vino/ui";
import { getProduct } from "@/lib/vino-data";
import { useVino } from "@/lib/vino-store";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Favourites — Vino Tasty Hub" },
      { name: "description", content: "All the Vino Tasty Hub dishes you saved for later." },
      { property: "og:title", content: "Favourites — Vino Tasty Hub" },
      { property: "og:description", content: "Your saved biryanis, cakes and teas." },
    ],
  }),
  component: Favorites,
});

function Favorites() {
  const { favorites } = useVino();
  const items = favorites.map(getProduct).filter(Boolean);

  return (
    <Screen>
      <TopBar title="Favourites" back="/profile" />
      {items.length ? (
        <div className="flex flex-col gap-3 px-4 pt-4">
          {items.map((p) => (
            <ProductCard key={p!.id} product={p!} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="favorite_border"
          title="No favourites yet"
          text="Tap the heart on any dish to save it here."
          ctaLabel="EXPLORE MENU"
          ctaTo="/categories"
        />
      )}
      <BottomNav />
    </Screen>
  );
}
