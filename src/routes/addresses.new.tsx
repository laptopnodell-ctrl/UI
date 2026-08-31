import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Icon, Screen, StickyBar, TopBar } from "@/components/vino/ui";
import { useVino } from "@/lib/vino-store";
import { img } from "@/lib/vino-images";

export const Route = createFileRoute("/addresses/new")({
  head: () => ({
    meta: [
      { title: "Add a new address — Vino Tasty Hub" },
      {
        name: "description",
        content: "Save a new delivery address for faster Vino Tasty Hub orders.",
      },
      { property: "og:title", content: "Add a new address — Vino Tasty Hub" },
      {
        property: "og:description",
        content: "Pin your location and save home, work or other addresses.",
      },
    ],
  }),
  component: NewAddress,
});

const labels = ["Home", "Work", "Other"] as const;

function NewAddress() {
  const { addAddress } = useVino();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    label: "Home" as (typeof labels)[number],
    line1: "",
    line2: "",
    landmark: "",
    city: "Kochi",
    pin: "",
    name: "",
    phone: "",
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.line1 && form.line2 && form.pin.length === 6 && form.name && form.phone.length >= 10;

  const fields: { key: keyof typeof form; label: string; placeholder: string }[] = [
    { key: "line1", label: "House / Flat number", placeholder: "12B, Palm Grove Apartments" },
    { key: "line2", label: "Street / Area", placeholder: "Panampilly Nagar" },
    { key: "landmark", label: "Landmark (optional)", placeholder: "Near Vino Tasty Hub" },
    { key: "city", label: "City", placeholder: "Kochi" },
    { key: "pin", label: "Pin code", placeholder: "682036" },
    { key: "name", label: "Name", placeholder: "Arjun Menon" },
    { key: "phone", label: "Phone number", placeholder: "+91 98470 12345" },
  ];

  return (
    <Screen>
      <TopBar title="Add New Address" back="/addresses" />

      <div className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-3xl">
          <img src={img.deliveryMap} alt="Map preview" className="h-40 w-full object-cover" />
          <span className="absolute inset-0 grid place-items-center">
            <Icon name="location_on" filled className="text-4xl text-primary drop-shadow" />
          </span>
          <button
            type="button"
            onClick={() => toast.success("Using your current location")}
            className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-bold text-primary-deep shadow-[var(--shadow-card)]"
          >
            <Icon name="my_location" className="text-base" /> Use current location
          </button>
        </div>
      </div>

      <div className="px-4 pt-5">
        <p className="text-xs font-bold text-muted-foreground uppercase">Save address as</p>
        <div className="mt-2 flex gap-2">
          {labels.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => set("label", l)}
              className={`vino-chip ${form.label === l ? "vino-chip-active" : ""}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 px-4">
        {fields.map((f) => (
          <label key={f.key} className="block">
            <span className="text-xs font-bold text-muted-foreground uppercase">{f.label}</span>
            <input
              value={form[f.key]}
              onChange={(e) =>
                set(f.key, f.key === "pin" ? e.target.value.replace(/\D/g, "").slice(0, 6) : e.target.value)
              }
              placeholder={f.placeholder}
              className="vino-card mt-1.5 w-full px-4 py-3 text-sm font-semibold outline-none placeholder:font-normal placeholder:text-muted-foreground focus:border-primary"
            />
          </label>
        ))}
      </div>

      <StickyBar>
        <button
          type="button"
          disabled={!valid}
          onClick={() => {
            addAddress({
              label: form.label,
              line1: form.line1,
              line2: form.landmark ? `${form.line2} (${form.landmark})` : form.line2,
              city: form.city,
              pin: form.pin,
              name: form.name,
              phone: form.phone,
            });
            toast.success("Address saved");
            navigate({ to: "/addresses" });
          }}
          className="vino-cta vino-cta-press disabled:opacity-50"
        >
          SAVE ADDRESS
        </button>
      </StickyBar>
    </Screen>
  );
}
