import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState, Icon, Screen, StickyBar, Stepper, VegBadge } from "@/components/vino/ui";
import { getProduct, inr, products } from "@/lib/vino-data";
import { useVino } from "@/lib/vino-store";
import { ProductTile } from "@/components/vino/ProductCard";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const p = getProduct(params.id);
    const title = p ? `${p.name} — Vino Tasty Hub` : "Dish — Vino Tasty Hub";
    const description = p
      ? `${p.description} Order ${p.name} for ${inr(p.price)} from Vino Tasty Hub.`
      : "Explore the Vino Tasty Hub menu.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(p
          ? [
              { property: "og:image", content: p.image },
              { name: "twitter:image", content: p.image },
            ]
          : []),
      ],
    };
  },
  component: ProductDetails,
});

function ProductDetails() {
  const { id } = Route.useParams();
  const product = getProduct(id);
  const navigate = useNavigate();
  const { addToCart, favorites, toggleFavorite } = useVino();

  const [variant, setVariant] = useState(product?.variants?.[0]?.label);
  const [addons, setAddons] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");

  if (!product) {
    return (
      <Screen padBottom={false}>
        <EmptyState
          icon="no_meals"
          title="Dish not found"
          text="This item may have been taken off the menu."
          ctaLabel="EXPLORE MENU"
          ctaTo="/categories"
        />
      </Screen>
    );
  }

  const fav = favorites.includes(product.id);
  const variantDelta = product.variants?.find((v) => v.label === variant)?.delta ?? 0;
  const addonTotal = (product.addons ?? [])
    .filter((a) => addons.includes(a.label))
    .reduce((s, a) => s + a.price, 0);
  const unitPrice = product.price + variantDelta + addonTotal;

  const similar = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 5);

  return (
    <Screen>
      {/* Framed & Rounded Hero Header Container */}
      <div className="px-3 pt-3">
        <div className="relative overflow-hidden rounded-3xl shadow-md">
          <img
            src={product.image}
            alt={product.name}
            className="h-72 w-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {/* Gradient Overlay for Readable Top Controls */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 via-black/30 to-transparent" />

          {/* Top Control Buttons */}
          <div className="absolute inset-x-0 top-0 flex justify-between p-3.5">
            <Link
              to="/categories"
              aria-label="Go back"
              className="grid size-10 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur-md transition-transform active:scale-95 shadow-sm"
            >
              <Icon name="arrow_back" className="text-xl" />
            </Link>
            <button
              type="button"
              aria-label={fav ? "Remove from favourites" : "Add to favourites"}
              onClick={() => toggleFavorite(product.id)}
              className="grid size-10 place-items-center rounded-full bg-background/80 backdrop-blur-md transition-transform active:scale-95 shadow-sm"
            >
              <Icon
                name="favorite"
                filled={fav}
                className={`text-xl ${fav ? "text-destructive" : "text-muted-foreground"}`}
              />
            </button>
          </div>

          {product.badge ? (
            <span className="absolute bottom-3 left-3.5 rounded-full bg-primary/90 px-3 py-1 text-xs font-bold text-primary-foreground backdrop-blur-md shadow-sm">
              {product.badge}
            </span>
          ) : null}
        </div>
      </div>

      {/* Main Details Body */}
      <div className="px-4 pt-4">
        {/* Title & Veg Badge Vertically Centered */}
        <div className="flex items-center gap-2.5">
          <VegBadge veg={product.veg} />
          <h1 className="flex-1 text-2xl font-extrabold tracking-tight text-foreground">
            {product.name}
          </h1>
        </div>

        {/* Rating & Meta Row */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-secondary-foreground">
            <Icon name="star" filled className="text-sm text-primary-deep" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-[11px] font-normal text-muted-foreground">
              ({product.reviews})
            </span>
          </div>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs font-semibold text-muted-foreground">{product.sub}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs font-bold text-primary-deep">25–30 mins</span>
        </div>

        {/* Price Row */}
        <div className="mt-3 flex items-baseline gap-2.5">
          <span className="text-2xl font-extrabold text-foreground">
            {inr(product.price + variantDelta)}
          </span>
          {product.mrp ? (
            <span className="text-sm font-semibold text-muted-foreground line-through">
              {inr(product.mrp)}
            </span>
          ) : null}
          {product.mrp ? (
            <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-bold text-secondary-foreground">
              Save {inr(product.mrp - (product.price + variantDelta))}
            </span>
          ) : null}
        </div>

        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        {product.unavailable ? (
          <div className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-3.5 text-sm font-semibold text-destructive">
            Currently unavailable. Check back at the next batch.
          </div>
        ) : null}

        {/* Variants Selection */}
        {product.variants ? (
          <section className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Choose size
              </h2>
              <span className="text-[11px] font-semibold text-muted-foreground">Required</span>
            </div>
            <div className="mt-2.5 flex flex-col gap-2">
              {product.variants.map((v) => {
                const isSelected = variant === v.label;
                return (
                  <button
                    key={v.label}
                    type="button"
                    onClick={() => setVariant(v.label)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3.5 text-sm font-semibold transition-all ${
                      isSelected
                        ? "border-primary bg-secondary/70 text-secondary-foreground shadow-xs"
                        : "border-border/80 bg-card text-foreground hover:border-primary/50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon
                        name={isSelected ? "radio_button_checked" : "radio_button_unchecked"}
                        className={`text-lg ${isSelected ? "text-primary-deep" : "text-muted-foreground"}`}
                      />
                      {v.label}
                    </span>
                    <span className="font-bold text-foreground">
                      {v.delta ? `+${inr(v.delta)}` : "Included"}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        {/* Addons Selection */}
        {product.addons ? (
          <section className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Add-ons
              </h2>
              <span className="text-[11px] font-semibold text-muted-foreground">Optional</span>
            </div>
            <div className="mt-2.5 flex flex-col gap-2">
              {product.addons.map((a) => {
                const on = addons.includes(a.label);
                return (
                  <button
                    key={a.label}
                    type="button"
                    onClick={() =>
                      setAddons(on ? addons.filter((x) => x !== a.label) : [...addons, a.label])
                    }
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3.5 text-sm font-semibold transition-all ${
                      on
                        ? "border-primary bg-secondary/70 text-secondary-foreground shadow-xs"
                        : "border-border/80 bg-card text-foreground hover:border-primary/50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon
                        name={on ? "check_box" : "check_box_outline_blank"}
                        className={`text-lg ${on ? "text-primary-deep" : "text-muted-foreground"}`}
                      />
                      {a.label}
                    </span>
                    <span className="font-bold text-foreground">+{inr(a.price)}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        {/* Special Instructions */}
        <section className="mt-6">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Special instructions
          </h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Less spicy, no onion, extra napkins..."
            className="vino-card mt-2.5 w-full resize-none px-4 py-3 text-sm outline-none transition-focus placeholder:text-muted-foreground focus:border-primary"
          />
        </section>

        {/* Quantity Stepper */}
        <section className="mt-6 flex items-center justify-between rounded-2xl border border-border/80 bg-card p-4">
          <div>
            <h2 className="text-sm font-bold text-foreground">Quantity</h2>
            <p className="text-xs text-muted-foreground">Select number of portions</p>
          </div>
          <Stepper qty={qty} onChange={(n) => setQty(Math.max(1, n))} />
        </section>

        {/* You May Also Like */}
        <section className="mt-8">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
            You may also like
          </h2>
          <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-2">
            {similar.map((p) => (
              <ProductTile key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>

      <StickyBar>
        <button
          type="button"
          disabled={product.unavailable}
          className="vino-cta vino-cta-press disabled:opacity-50"
          onClick={() => {
            addToCart({
              productId: product.id,
              qty,
              addons,
              unitPrice,
              ...(variant ? { variant } : {}),
            });
            toast.success(`${product.name} added to cart`);
            navigate({ to: "/cart" });
          }}
        >
          ADD TO CART · {inr(unitPrice * qty)}
        </button>
      </StickyBar>
    </Screen>
  );
}
