import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Icon, Screen, StickyBar, TopBar } from "@/components/vino/ui";
import { useVino } from "@/lib/vino-store";

export const Route = createFileRoute("/addresses/new")({
  head: () => ({
    meta: [
      { title: "Add a new address — Vino Tasty Hub" },
      { name: "description", content: "Save a new delivery address for faster Vino Tasty Hub orders." },
      { property: "og:title", content: "Add a new address — Vino Tasty Hub" },
      { property: "og:description", content: "Pin your location and save home, work or other addresses." },
    ],
  }),
  component: NewAddress;
});

function NewAddress() {
  return null;
}
