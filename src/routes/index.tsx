import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { img } from "@/lib/vino-images";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vino Tasty Hub — Restaurant • Bakery • Tea" },
      {
        name: "description",
        content:
          "Vino Tasty Hub delivers biryani, bakery favourites and fresh tea across Kochi in minutes.",
      },
      { property: "og:title", content: "Vino Tasty Hub — Restaurant • Bakery • Tea" },
      {
        property: "og:description",
        content: "Order restaurant meals, bakery treats and hot tea from Vino Tasty Hub.",
      },
    ],
  }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const seen = localStorage.getItem("vino-onboarded");
    const t = setTimeout(() => {
      navigate({ to: seen ? "/home" : "/onboarding" });
    }, 1900);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center bg-background px-8">
      <img
        src={img.logo}
        alt="Vino Tasty Hub"
        className="h-20 w-auto object-contain mix-blend-multiply animate-in fade-in zoom-in duration-700"
      />
      <p className="mt-4 text-sm font-semibold tracking-[0.18em] text-primary-deep uppercase">
        Restaurant • Bakery • Tea
      </p>
      <div className="mt-12 h-1 w-32 overflow-hidden rounded-full bg-secondary">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
      </div>
      <Link to="/home" className="mt-8 text-xs font-semibold text-muted-foreground">
        Skip
      </Link>
    </div>
  );
}
