import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState, Icon, Rating, Screen, StickyBar, Stepper, VegBadge } from "@/components/vino/ui";
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

  const similar = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 5);

  return (
    <Screen>
      <div className="relative">
        <img src={product.image} alt={product.name} className="h-72 w-full object-cover" />
        <div className="absolute inset-x-0 top-0 flex justify-between p-4">
          <Link
            to="/categories"
            aria-label="Go back"
            className="grid size-10 place-items-center rounded-full bg-card/90 text-primary-deep backdrop-blur"
          >
            <Icon name="arrow_back" className="text-xl" />
          </Link>
          <button
            type="button"
            aria-label={fav ? "Remove from favourites" : "Add to favourites"}
            onClick={() => toggleFavorite(product.id)}
            className="grid size-10 place-items-center rounded-full bg-card/90 backdrop-blur"
          >
            <Icon
              name="favorite"
              filled={fav}
              className={`text-xl ${fav ? "text-destructive" : "text-muted-foreground"}`}
            />
          </button>
        </div>
      </div>

      <div className="-mt-6 rounded-t-3xl bg-background px-4 pt-5">
        <div className="flex items-start gap-2">
          <VegBadge veg={product.veg} />
          <h1 className="flex-1 text-[22px] leading-tight font-extrabold text-foreground">
            {product.name}
          </h1>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <Rating value={product.rating} reviews={product.reviews} />
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs font-semibold text-muted-foreground">
            {product.sub} · 25–30 mins
          </span>
        </div>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-foreground">{inr(product.price + variantDelta)}</span>
          {product.mrp ? (
            <span className="text-sm text-muted-foreground line-through">{inr(product.mrp)}</span>
          ) : null}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

        {product.unavailable ? (
          <div className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-sm font-semibold text-destructive">
            Currently unavailable. Check back at the next batch.
          </div>
        ) : null}

        {product.variants ? (
          <section className="mt-6">
            <h2 className="text-[15px] font-bold text-foreground">Choose a size</h2>
            <div className="mt-2 flex flex-col gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.label}
                  type="button"
                  onClick={() => setVariant(v.label)}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold ${
                    variant === v.label
                      ? "border-primary bg-secondary text-secondary-foreground"
                      : "border-border bg-card text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon
                      name={variant === v.label ? "radio_button_checked" : "radio_button_unchecked"}
                      className="text-lg text-primary-deep"
                    />
                    {v.label}
                  </span>
                  <span>{v.delta ? `+${inr(v.delta)}` : "Included"}</span>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {product.addons ? (
          <section className="mt-6">
            <h2 className="text-[15px] font-bold text-foreground">Add-ons</h2>
            <p className="text-xs text-muted-foreground">Optional — pick as many as you like</p>
            <div className="mt-2 flex flex-col gap-2">
              {product.addons.map((a) => {
                const on = addons.includes(a.label);
                return (
                  <button
                    key={a.label}
                    type="button"
                    onClick={() =>
                      setAddons(on ? addons.filter((x) => x !== a.label) : [...addons, a.label])
                    }
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold ${
                      on ? "border-primary bg-secondary text-secondary-foreground" : "border-border bg-card text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon
                        name={on ? "check_box" : "check_box_outline_blank"}
                        className="text-lg text-primary-deep"
                      />
                      {a.label}
                    </span>
                    <span>+{inr(a.price)}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="mt-6">
          <h2 className="text-[15px] font-bold text-foreground">Special instructions</h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Less spicy, no onion, extra napkins..."
            className="vino-card mt-2 w-full resize-none px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
        </section>

        <section className="mt-6 flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-foreground">Quantity</h2>
          <Stepper qty={qty} onChange={(n) => setQty(Math.max(1, n))} />
        </section>

        <section className="mt-8">
          <h2 className="text-[15px] font-bold text-foreground">You may also like</h2>
          <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
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
            addToCart({ productId: product.id, qty, addons, unitPrice, ...(variant ? { variant } : {}) });
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
