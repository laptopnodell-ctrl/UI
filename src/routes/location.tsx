import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Icon, Screen, StickyBar, TopBar } from "@/components/vino/ui";
import { useVino } from "@/lib/vino-store";

export const Route = createFileRoute("/location")({
  head: () => ({
    meta: [
      { title: "Where should we deliver? — Vino Tasty Hub" },
      {
        name: "description",
        content:
          "Pick your delivery location and save your house, street, landmark, city and pincode for faster Vino Tasty Hub orders.",
      },
      { property: "og:title", content: "Where should we deliver? — Vino Tasty Hub" },
      {
        property: "og:description",
        content: "Choose a location to see what's available near you.",
      },
    ],
  }),
  component: LocationScreen,
});

const labels = ["Home", "Work", "Other"] as const;
const labelIcons = { Home: "home", Work: "work", Other: "location_on" } as const;

function MapPlaceholder({ caption }: { caption: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-muted">
      <svg viewBox="0 0 320 180" className="h-44 w-full" role="presentation">
        <rect width="320" height="180" fill="oklch(0.96 0.02 80)" />
        <path d="M-10 130 L150 60 L340 110" stroke="oklch(1 0 0)" strokeWidth="12" fill="none" />
        <path d="M60 -10 L90 190" stroke="oklch(1 0 0)" strokeWidth="9" fill="none" />
        <path d="M230 -10 L210 190" stroke="oklch(1 0 0)" strokeWidth="7" fill="none" />
        <path d="M-10 40 L340 30" stroke="oklch(0.99 0.01 80)" strokeWidth="6" fill="none" />
        <rect x="18" y="46" width="34" height="26" rx="5" fill="oklch(0.93 0.03 85)" />
        <rect x="106" y="96" width="46" height="30" rx="5" fill="oklch(0.93 0.03 85)" />
        <rect x="244" y="128" width="40" height="28" rx="5" fill="oklch(0.93 0.03 85)" />
        <rect x="252" y="52" width="30" height="22" rx="5" fill="oklch(0.93 0.03 85)" />
      </svg>
      <span className="pointer-events-none absolute inset-0 grid place-items-center">
        <span className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-card)]">
          <Icon name="location_on" filled className="text-2xl" />
        </span>
      </span>
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground/85 px-3 py-1.5 text-[11px] font-bold text-background">
        {caption}
      </span>
    </div>
  );
}

function LocationScreen() {
  const { addAddress, setDefaultAddress } = useVino();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("Kakkanad, Kochi, Kerala");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [form, setForm] = useState({
    label: "Home" as (typeof labels)[number],
    houseOrBuilding: "",
    street: "",
    landmark: "",
    city: "Kochi",
    pincode: "",
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const valid =
    form.houseOrBuilding.trim() && form.street.trim() && form.city.trim() && form.pincode.length === 6;

  const useCurrentLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error("Location isn't available on this device. Please enter your address manually.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setSelected("Kakkanad, Kochi, Kerala");
        toast.success("Location detected");
      },
      () => {
        setLocating(false);
        toast.error("Location access denied. Please enter your address manually.");
      },
      { timeout: 8000 },
    );
  };

  const save = () => {
    const formattedAddress = [
      form.houseOrBuilding,
      form.street,
      form.landmark,
      `${form.city} ${form.pincode}`,
    ]
      .filter(Boolean)
      .join(", ");

    const id = addAddress({
      label: form.label,
      line1: form.houseOrBuilding,
      line2: form.street,
      landmark: form.landmark,
      city: form.city,
      pin: form.pincode,
      name: "Arjun Menon",
      phone: "+91 98470 12345",
      formattedAddress,
    });
    setDefaultAddress(id);
    localStorage.setItem(
      "vino_default_address",
      JSON.stringify({
        id,
        address: {
          id,
          label: form.label.toLowerCase(),
          houseOrBuilding: form.houseOrBuilding,
          street: form.street,
          landmark: form.landmark,
          city: form.city,
          pincode: form.pincode,
          formattedAddress,
          isDefault: true,
        },
      }),
    );
    toast.success("Delivery address saved");
    navigate({ to: "/home" });
  };

  const fields: {
    key: "houseOrBuilding" | "street" | "landmark" | "city" | "pincode";
    label: string;
    placeholder: string;
  }[] = [
    { key: "houseOrBuilding", label: "House / Flat / Building *", placeholder: "Apt 4B, Skyline Apartments" },
    { key: "street", label: "Street / Area *", placeholder: "Infopark Road, Kakkanad" },
    { key: "landmark", label: "Landmark (optional)", placeholder: "e.g. Near Metro Station" },
    { key: "city", label: "City *", placeholder: "Kochi" },
    { key: "pincode", label: "Pincode *", placeholder: "682030" },
  ];

  return (
    <Screen>
      <TopBar title="Where should we deliver?" subtitle="Choose a location to see what's available near you." back="/login" />

      <div className="px-4 pt-4">
        <label className="vino-card flex items-center gap-2 px-4 py-3">
          <Icon name="search" className="text-lg text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.trim()) setSelected(`${e.target.value.trim()}, Kochi, Kerala`);
            }}
            placeholder="Search area, street or landmark"
            className="w-full bg-transparent text-sm font-semibold outline-none placeholder:font-normal placeholder:text-muted-foreground"
          />
        </label>

        <button
          type="button"
          onClick={useCurrentLocation}
          className="vino-card mt-3 flex w-full items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold text-primary-deep"
        >
          <Icon name="my_location" filled className="text-lg text-primary" />
          {locating ? "Detecting location…" : "Use my current location"}
        </button>

        <div className="mt-4">
          <MapPlaceholder caption="Move pin to adjust location" />
        </div>

        <div className="mt-4 flex items-start gap-2">
          <Icon name="push_pin" filled className="text-lg text-primary" />
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              Selected location
            </p>
            <p className="text-base font-extrabold text-foreground">{selected}</p>
            {coords ? (
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 px-4">
        {fields.map((f) => (
          <label key={f.key} className="vino-card block px-4 py-3">
            <span className="text-[11px] font-bold text-muted-foreground">{f.label}</span>
            <input
              value={form[f.key]}
              onChange={(e) =>
                set(
                  f.key,
                  f.key === "pincode" ? e.target.value.replace(/\D/g, "").slice(0, 6) : e.target.value,
                )
              }
              placeholder={f.placeholder}
              className="mt-0.5 w-full bg-transparent text-sm font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground"
            />
          </label>
        ))}
      </div>

      <div className="px-4 pt-5">
        <h2 className="text-base font-extrabold text-foreground">Save as</h2>
        <div className="mt-2 grid grid-cols-3 gap-3">
          {labels.map((l) => {
            const active = form.label === l;
            return (
              <button
                key={l}
                type="button"
                onClick={() => set("label", l)}
                className={`vino-card flex flex-col items-center gap-1 py-3 text-xs font-bold ${
                  active ? "border-primary bg-primary/10 text-primary-deep" : "text-muted-foreground"
                }`}
              >
                <Icon name={labelIcons[l]} className="text-xl" />
                {l}
              </button>
            );
          })}
        </div>
      </div>

      <StickyBar>
        <button
          type="button"
          disabled={!valid}
          onClick={save}
          className="vino-cta vino-cta-press disabled:opacity-50"
        >
          SAVE &amp; CONTINUE
        </button>
      </StickyBar>
    </Screen>
  );
}
