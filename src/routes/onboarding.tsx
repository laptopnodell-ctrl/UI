import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { img } from "@/lib/vino-images";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome to Vino Tasty Hub" },
      {
        name: "description",
        content: "Discover restaurant meals, bakery favourites and fresh tea on Vino Tasty Hub.",
      },
      { property: "og:title", content: "Welcome to Vino Tasty Hub" },
      {
        property: "og:description",
        content: "Everything you crave — restaurant, bakery and tea, in one warm app.",
      },
    ],
  }),
  component: Onboarding,
});

const slides = [
  {
    image: img.onboard1,
    title: "Everything you crave, in one place",
    text: "Restaurant meals, bakery favourites and refreshing tea from Vino Tasty Hub.",
  },
  {
    image: img.onboard2,
    title: "Freshly prepared, every day",
    text: "Baked each morning and cooked to order, so every bite arrives warm.",
  },
  {
    image: img.onboard3,
    title: "Delivered hot to your door",
    text: "Live tracking, easy reorders and offers made for your neighbourhood.",
  },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const slide = slides[i]!;

  const finish = () => {
    localStorage.setItem("vino-onboarded", "1");
    navigate({ to: "/login" });
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <div className="flex justify-end px-5 pt-5">
        <button type="button" onClick={finish} className="text-sm font-semibold text-muted-foreground">
          Skip
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center px-6 pt-4">
        <img
          src={slide.image}
          alt={slide.title}
          className="aspect-square w-full rounded-[2rem] object-cover shadow-[var(--shadow-float)]"
        />
        <h1 className="mt-8 text-center text-[28px] leading-tight font-extrabold text-foreground">
          {slide.title}
        </h1>
        <p className="mt-3 text-center text-sm text-muted-foreground">{slide.text}</p>
      </div>

      <div className="px-6 pb-10">
        <div className="mb-6 flex justify-center gap-2">
          {slides.map((s, idx) => (
            <span
              key={s.title}
              className={`h-2 rounded-full transition-all ${
                idx === i ? "w-6 bg-primary" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          className="vino-cta vino-cta-press"
          onClick={() => (i === slides.length - 1 ? finish() : setI(i + 1))}
        >
          {i === slides.length - 1 ? "GET STARTED" : "NEXT"}
        </button>
      </div>
    </div>
  );
}
