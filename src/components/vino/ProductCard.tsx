import { Link } from "@tanstack/react-router";
import { inr, type Product } from "@/lib/vino-data";
import { useVino } from "@/lib/vino-store";
import { Icon, Rating, Stepper, VegBadge } from "./ui";

export function ProductCard({ product }: { product: Product }) {
  const { cart, favorites, toggleFavorite, addToCart, setQty } = useVino();
  const line = cart.find((l) => l.productId === product.id && !l.variant && l.addons.length === 0);
  const fav = favorites.includes(product.id);

  return (
    <article className="vino-card flex gap-3 p-3">
      <Link to="/product/$id" params={{ id: product.id }} className="relative shrink-0">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`size-24 rounded-xl object-cover ${product.unavailable ? "opacity-45 grayscale" : ""}`}
        />
        {product.badge ? (
          <span className="absolute -top-1 -left-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
            {product.badge}
          </span>
        ) : null}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <VegBadge veg={product.veg} />
          <Link
            to="/product/$id"
            params={{ id: product.id }}
            className="min-w-0 flex-1 text-sm font-bold leading-tight text-foreground"
          >
            {product.name}
          </Link>
          <button
            type="button"
            aria-label={fav ? "Remove from favourites" : "Add to favourites"}
            onClick={() => toggleFavorite(product.id)}
            className="shrink-0"
          >
            <Icon
              name="favorite"
              filled={fav}
              className={`text-lg ${fav ? "text-destructive" : "text-muted-foreground"}`}
            />
          </button>
        </div>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
        <div className="mt-1.5">
          <Rating value={product.rating} reviews={product.reviews} />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-foreground">{inr(product.price)}</span>
            {product.mrp ? (
              <span className="text-xs text-muted-foreground line-through">{inr(product.mrp)}</span>
            ) : null}
          </p>

          {product.unavailable ? (
            <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-bold text-muted-foreground">
              Unavailable
            </span>
          ) : line ? (
            <Stepper qty={line.qty} onChange={(n) => setQty(line.key, n)} small />
          ) : (
            <button
              type="button"
              aria-label={`Add ${product.name} to cart`}
              onClick={() =>
                addToCart({
                  productId: product.id,
                  qty: 1,
                  addons: [],
                  unitPrice: product.price,
                })
              }
              className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-card)] active:scale-95"
            >
              <Icon name="add" className="text-xl" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductTile({ product }: { product: Product }) {
  const { addToCart } = useVino();
  return (
    <article className="vino-card w-40 shrink-0 overflow-hidden">
      <Link to="/product/$id" params={{ id: product.id }}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-28 w-full object-cover"
        />
      </Link>
      <div className="p-3">
        <div className="flex items-center gap-1.5">
          <VegBadge veg={product.veg} />
          <Link
            to="/product/$id"
            params={{ id: product.id }}
            className="truncate text-sm font-bold text-foreground"
          >
            {product.name}
          </Link>
        </div>
        <div className="mt-1">
          <Rating value={product.rating} />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-bold text-foreground">{inr(product.price)}</span>
          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            onClick={() =>
              addToCart({ productId: product.id, qty: 1, addons: [], unitPrice: product.price })
            }
            className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground active:scale-95"
          >
            <Icon name="add" className="text-lg" />
          </button>
        </div>
      </div>
    </article>
  );
}
