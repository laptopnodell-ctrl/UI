import { Link, useRouterState } from "@tanstack/react-router";
import { Icon } from "./ui";
import { useVino } from "@/lib/vino-store";

const tabs = [
  { to: "/home", icon: "home", label: "Home" },
  { to: "/categories", icon: "grid_view", label: "Categories" },
  { to: "/cart", icon: "shopping_bag", label: "Cart" },
  { to: "/orders", icon: "receipt_long", label: "Orders" },
  { to: "/profile", icon: "person", label: "Profile" },
] as const;

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { bill } = useVino();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-border/60 bg-card/95 backdrop-blur">
      <ul className="flex items-stretch justify-between px-2 pt-2 pb-3">
        {tabs.map((t) => {
          const active = path === t.to || path.startsWith(`${t.to}/`);
          return (
            <li key={t.to} className="flex-1">
              <Link
                to={t.to}
                className="flex flex-col items-center gap-1"
                aria-current={active ? "page" : undefined}
              >
                <span className="relative">
                  <Icon
                    name={t.icon}
                    filled={active}
                    className={`text-2xl ${active ? "text-primary-deep" : "text-muted-foreground"}`}
                  />
                  {t.to === "/cart" && bill.count > 0 ? (
                    <span className="absolute -top-1 -right-2 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {bill.count}
                    </span>
                  ) : null}
                </span>
                <span
                  className={`text-[11px] font-semibold ${
                    active ? "text-primary-deep" : "text-muted-foreground"
                  }`}
                >
                  {t.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
