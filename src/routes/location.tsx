import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Icon, Screen, StickyBar } from "@/components/vino/ui";
import { useVino } from "@/lib/vino-store";
import { img } from "@/lib/vino-images";

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

const labelOptions = [
  { id: "Home", label: "Home", icon: "home" },
  { id: "Work", label: "Work", icon: "work" },
  { id: "Other", label: "Other", icon: "location_on" },
] as const;

type AddressLabel = "Home" | "Work" | "Other";

function PremiumMap({ caption }: { caption: string }) {
  return (
    <div className="relative h-52 w-full overflow-hidden rounded-[22px] border border-border/80 bg-[#f6efe7] shadow-xs">
      <svg
        viewBox="0 0 400 220"
        className="h-full w-full object-cover select-none"
        role="presentation"
      >
        {/* Base Map Background */}
        <rect width="400" height="220" fill="#f5ede3" />

        {/* Soft Parks / Green Accents */}
        <path
          d="M 10 20 Q 50 10 90 35 T 140 70 L 110 110 L 20 80 Z"
          fill="#e8eedd"
          opacity="0.8"
        />
        <path
          d="M 280 130 Q 330 110 380 140 L 390 200 L 290 210 Z"
          fill="#e8eedd"
          opacity="0.75"
        />

        {/* Major & Minor Soft Roads */}
        <path
          d="M -20 160 C 100 130, 220 110, 420 80"
          stroke="#ffffff"
          strokeWidth="16"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 120 -20 C 130 80, 160 160, 190 240"
          stroke="#ffffff"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 270 -20 C 260 90, 290 170, 310 240"
          stroke="#ffffff"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M -10 60 L 410 40"
          stroke="#ffffff"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 40 230 L 370 190"
          stroke="#ffffff"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Warm Building Blocks */}
        <rect x="25" y="90" width="48" height="34" rx="6" fill="#ece0d2" />
        <rect x="145" y="30" width="60" height="40" rx="6" fill="#ece0d2" />
        <rect x="220" y="25" width="38" height="28" rx="6" fill="#e5d8c8" />
        <rect x="140" y="140" width="52" height="36" rx="6" fill="#ece0d2" />
        <rect x="210" y="125" width="56" height="42" rx="6" fill="#ece0d2" />
        <rect x="330" y="55" width="46" height="32" rx="6" fill="#ece0d2" />
      </svg>

      {/* Strong Orange Center Pin with Pulsing Glow */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center -translate-y-2">
        <div className="relative flex items-center justify-center">
          <span className="absolute size-14 animate-ping rounded-full bg-primary/20 duration-1000" />
          <div className="relative grid size-11 place-items-center rounded-full bg-primary text-foreground shadow-lg border-2 border-card">
            <Icon name="location_on" filled className="text-2xl text-foreground" />
          </div>
        </div>
        <div className="mt-1 h-1.5 w-5 rounded-full bg-[#241A12]/20 blur-[1px]" />
      </div>

      {/* Floating Charcoal Helper Pill */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#241A12]/85 px-3.5 py-1.5 text-[11px] font-semibold text-white shadow-md backdrop-blur-xs">
          <Icon name="touch_app" className="text-xs text-amber-300" />
          {caption}
        </span>
      </div>
    </div>
  );
}

function LocationScreen() {
  const { addAddress, setDefaultAddress } = useVino();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [selectedMain, setSelectedMain] = useState("Kakkanad, Kochi, Kerala");
  const [selectedSub, setSelectedSub] = useState("Infopark Road, Kakkanad");
  const [locating, setLocating] = useState(false);

  const [selectedLabel, setSelectedLabel] = useState<AddressLabel>("Home");
  const [customLabel, setCustomLabel] = useState("");

  const [form, setForm] = useState({
    houseOrBuilding: "",
    street: "Infopark Road, Kakkanad",
    landmark: "",
    city: "Kochi",
    pincode: "682030",
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const valid =
    form.houseOrBuilding.trim().length > 0 &&
    form.street.trim().length > 0 &&
    form.city.trim().length > 0 &&
    form.pincode.length === 6;

  const useCurrentLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error("Location isn't available on this device. Please enter your address manually.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocating(false);
        setSelectedMain("Kakkanad, Kochi, Kerala");
        setSelectedSub("Near Infopark Expressway, Kochi");
        set("street", "Infopark Expressway, Kakkanad");
        toast.success("Location detected accurately");
      },
      () => {
        setLocating(false);
        toast.error("Location access denied. Please enter your address manually.");
      },
      { timeout: 8000 },
    );
  };

  const handleSearchChange = (val: string) => {
    setQuery(val);
    if (val.trim()) {
      setSelectedMain(`${val.trim()}, Kochi, Kerala`);
      setSelectedSub(val.trim());
      set("street", val.trim());
    }
  };

  const handleChangeLocationClick = () => {
    searchInputRef.current?.focus();
    toast.info("Type above to search or adjust pin");
  };

  const save = () => {
    const activeLabel =
      selectedLabel === "Other" && customLabel.trim()
        ? "Other"
        : selectedLabel;

    const formattedAddress = [
      form.houseOrBuilding,
      form.street,
      form.landmark,
      `${form.city} ${form.pincode}`,
    ]
      .filter(Boolean)
      .join(", ");

    const id = addAddress({
      label: activeLabel,
      line1: form.houseOrBuilding,
      line2: form.landmark ? `${form.street} (${form.landmark})` : form.street,
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
          label: selectedLabel === "Other" && customLabel.trim() ? customLabel.trim() : activeLabel,
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

    toast.success("Delivery address saved!");
    navigate({ to: "/home" });
  };

  return (
    <Screen padBottom={false}>
      {/* Header */}
      <header className="sticky top-0 z-30 vino-surface-sticky border-b border-border/60 h-[60px] flex items-center px-4">
        <div className="flex w-full items-center gap-2.5">
          <Link
            to="/login"
            aria-label="Go back"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-border/80 bg-card text-foreground shadow-2xs transition-all hover:bg-secondary active:scale-95"
          >
            <Icon name="arrow_back" className="text-lg" />
          </Link>
          <img
            src={img.logo}
            alt="Vino"
            className="h-8 w-auto object-contain mix-blend-multiply shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold text-foreground tracking-tight font-display leading-tight">
              Where should we deliver?
            </h1>
            <p className="truncate text-xs font-medium text-muted-foreground leading-tight mt-0.5">
              Choose a location to see what's available near you.
            </p>
          </div>
        </div>
      </header>

      {/* Main Form Content Container */}
      <div className="mx-auto w-full max-w-md px-4 pt-3.5 pb-28 space-y-4">
        {/* 1. Location Search */}
        <div className="rounded-[16px] border border-border bg-card px-3.5 py-2.5 shadow-2xs flex items-center gap-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
          <Icon name="search" className="text-lg text-muted-foreground" />
          <input
            ref={searchInputRef}
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search area, street or landmark"
            className="w-full bg-transparent text-sm font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground"
          />
          {query ? (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <Icon name="close" className="text-base" />
            </button>
          ) : null}
        </div>

        {/* 2. Current Location Button */}
        <button
          type="button"
          onClick={useCurrentLocation}
          className="vino-card flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-foreground transition-all hover:bg-secondary/40 active:scale-[0.99]"
        >
          <Icon name="my_location" filled className="text-lg text-primary" />
          <span>{locating ? "Detecting location…" : "Use my current location"}</span>
        </button>

        {/* 3. Interactive Map Section */}
        <PremiumMap caption="Move pin to adjust location" />

        {/* 4. Selected Location Card */}
        <div className="rounded-[18px] border border-border/80 bg-card p-3.5 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/15 text-primary-deep mt-0.5">
              <Icon name="location_on" filled className="text-base text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                SELECTED LOCATION
              </p>
              <p className="truncate text-sm font-bold text-foreground">
                {selectedMain}
              </p>
              {selectedSub ? (
                <p className="truncate text-xs text-muted-foreground mt-0.5">
                  {selectedSub}
                </p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={handleChangeLocationClick}
            className="shrink-0 text-xs font-bold text-primary-deep hover:underline px-2 py-1"
          >
            Change
          </button>
        </div>

        {/* 5. Address Details Form */}
        <div className="pt-2">
          <h2 className="text-[15px] font-bold text-foreground mb-2.5">
            Address Details
          </h2>

          <div className="space-y-2.5">
            {/* House / Flat / Building */}
            <label className="block rounded-[16px] border border-border/80 bg-card px-3.5 py-2.5 shadow-2xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                House / Flat / Building *
              </span>
              <input
                value={form.houseOrBuilding}
                onChange={(e) => set("houseOrBuilding", e.target.value)}
                placeholder="Apt 4B, Skyline Apartments"
                className="mt-0.5 w-full bg-transparent text-sm font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground"
              />
            </label>

            {/* Street / Area */}
            <label className="block rounded-[16px] border border-border/80 bg-card px-3.5 py-2.5 shadow-2xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Street / Area *
              </span>
              <input
                value={form.street}
                onChange={(e) => set("street", e.target.value)}
                placeholder="Infopark Road, Kakkanad"
                className="mt-0.5 w-full bg-transparent text-sm font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground"
              />
            </label>

            {/* Landmark */}
            <label className="block rounded-[16px] border border-border/80 bg-card px-3.5 py-2.5 shadow-2xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Landmark
              </span>
              <input
                value={form.landmark}
                onChange={(e) => set("landmark", e.target.value)}
                placeholder="Near Infopark Phase 1"
                className="mt-0.5 w-full bg-transparent text-sm font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground"
              />
            </label>

            {/* City & Pincode Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <label className="block rounded-[16px] border border-border/80 bg-card px-3.5 py-2.5 shadow-2xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  City *
                </span>
                <input
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="Kochi"
                  className="mt-0.5 w-full bg-transparent text-sm font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground"
                />
              </label>

              <label className="block rounded-[16px] border border-border/80 bg-card px-3.5 py-2.5 shadow-2xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Pincode *
                </span>
                <input
                  value={form.pincode}
                  maxLength={6}
                  inputMode="numeric"
                  onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="682030"
                  className="mt-0.5 w-full bg-transparent text-sm font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground"
                />
              </label>
            </div>
          </div>
        </div>

        {/* 6. Save As Section */}
        <div className="pt-2">
          <h2 className="text-[15px] font-bold text-foreground mb-2">Save as</h2>
          <div className="grid grid-cols-3 gap-2.5">
            {labelOptions.map((opt) => {
              const active = selectedLabel === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedLabel(opt.id)}
                  className={`flex items-center justify-center gap-1.5 rounded-[16px] py-2.5 px-3 text-xs font-bold transition-all shadow-2xs border ${
                    active
                      ? "border-primary bg-primary/12 text-primary-deep"
                      : "border-border/80 bg-card text-muted-foreground hover:bg-secondary/40"
                  }`}
                >
                  <Icon
                    name={opt.icon}
                    filled={active}
                    className={`text-base ${active ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Conditional Custom Label input when "Other" is chosen */}
          {selectedLabel === "Other" ? (
            <div className="mt-2.5">
              <label className="block rounded-[16px] border border-border/80 bg-card px-3.5 py-2.5 shadow-2xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Custom label
                </span>
                <input
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  placeholder="e.g. Parents' Home, Office Annex"
                  className="mt-0.5 w-full bg-transparent text-sm font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground"
                />
              </label>
            </div>
          ) : null}
        </div>
      </div>

      {/* 7. Sticky Bottom CTA */}
      <StickyBar>
        <button
          type="button"
          disabled={!valid}
          onClick={save}
          className={`vino-cta-press flex h-14 w-full items-center justify-center gap-2 rounded-[16px] font-extrabold text-[15px] tracking-wide transition-all shadow-md ${
            valid
              ? "bg-primary text-foreground shadow-primary/20 hover:brightness-105 active:scale-[0.98]"
              : "bg-primary/40 text-foreground/50 cursor-not-allowed shadow-none"
          }`}
        >
          <span>SAVE &amp; CONTINUE</span>
          <Icon name="arrow_forward" className="text-lg" />
        </button>
      </StickyBar>
    </Screen>
  );
}

