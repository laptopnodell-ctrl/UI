import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { BottomNav } from "@/components/vino/BottomNav";
import { Icon, Row, Screen, TopBar } from "@/components/vino/ui";
import { img } from "@/lib/vino-images";
import { useVino } from "@/lib/vino-store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My profile — Vino Tasty Hub" },
      {
        name: "description",
        content: "Manage your Vino Tasty Hub profile, addresses, favourites and settings.",
      },
      { property: "og:title", content: "My profile — Vino Tasty Hub" },
      { property: "og:description", content: "Your account, saved addresses and preferences." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { favorites, addresses } = useVino();

  return (
    <Screen>
      <TopBar title="Profile" />

      <div className="px-4 pt-4">
        <div className="vino-card flex items-center gap-3 p-4">
          <img
            src={img.avatar}
            alt="Your profile photo"
            className="size-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="text-base font-extrabold text-foreground">Arjun Menon</p>
            <p className="text-xs text-muted-foreground">+91 98470 12345</p>
            <p className="text-xs text-muted-foreground">arjun.menon@example.com</p>
          </div>
          <button
            type="button"
            aria-label="Edit profile"
            onClick={() => toast.success("Profile editing coming soon")}
            className="grid size-9 place-items-center rounded-full bg-secondary text-primary-deep"
          >
            <Icon name="edit" className="text-lg" />
          </button>
        </div>
      </div>

      <section className="mt-6 px-4">
        <h2 className="text-xs font-bold uppercase text-muted-foreground">Account</h2>
        <div className="vino-card mt-2 divide-y divide-border">
          <Row
            icon="favorite"
            label="Favourites"
            detail={`${favorites.length} saved`}
            to="/favorites"
          />
          <Row
            icon="location_on"
            label="Saved addresses"
            detail={`${addresses.length} addresses`}
            to="/addresses"
          />
          <Row icon="receipt_long" label="My orders" to="/orders" />
          <Row icon="local_offer" label="Coupons & offers" to="/coupons" />
          <Row icon="notifications" label="Notifications" to="/notifications" />
        </div>
      </section>

      <section className="mt-6 px-4">
        <h2 className="text-xs font-bold uppercase text-muted-foreground">Support</h2>
        <div className="vino-card mt-2 divide-y divide-border">
          <Row icon="help" label="Help & support" to="/help" />
          <Row
            icon="description"
            label="Terms & privacy"
            onClick={() => toast.success("Opening policies")}
          />
          <Row
            icon="star"
            label="Rate the app"
            onClick={() => toast.success("Thanks for the love!")}
          />
        </div>
      </section>

      <section className="mt-6 px-4">
        <div className="vino-card divide-y divide-border">
          <Row icon="logout" label="Log out" to="/login" danger />
        </div>
      </section>

      <p className="pt-6 text-center text-[11px] text-muted-foreground">Vino Tasty Hub · v1.0.0</p>

      <BottomNav />
    </Screen>
  );
}
