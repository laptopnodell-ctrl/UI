import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { img } from "@/lib/vino-images";
import { Icon } from "@/components/vino/ui";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Vino Tasty Hub" },
      {
        name: "description",
        content: "Log in with your mobile number to order from Vino Tasty Hub.",
      },
      { property: "og:title", content: "Log in — Vino Tasty Hub" },
      { property: "og:description", content: "Sign in with your phone number and start ordering." },
    ],
  }),
  component: Login,
});

function Login() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const valid = /^\d{10}$/.test(phone);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background px-6 pt-14 pb-10">
      <img src={img.logo} alt="Vino Tasty Hub" className="h-14 w-auto self-center" />
      <h1 className="mt-10 text-[26px] font-extrabold text-foreground">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Log in with your mobile number to order restaurant meals, bakery treats and tea.
      </p>

      <label className="mt-8 block text-xs font-bold text-muted-foreground uppercase">
        Mobile number
      </label>
      <div className="vino-card mt-2 flex items-center gap-2 px-4 py-3">
        <span className="text-sm font-bold text-foreground">+91</span>
        <span className="h-5 w-px bg-border" />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
          inputMode="numeric"
          placeholder="98470 12345"
          className="flex-1 bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <button
        type="button"
        disabled={!valid}
        onClick={() => navigate({ to: "/otp", search: { phone } })}
        className="vino-cta vino-cta-press mt-6 disabled:opacity-50"
      >
        CONTINUE
      </button>

      <div className="my-7 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-semibold text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: "g_translate", label: "Google" },
          { icon: "phone_iphone", label: "Apple" },
        ].map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => toast.info(`${p.label} sign-in coming soon`)}
            className="vino-card flex items-center justify-center gap-2 py-3 text-sm font-bold text-foreground"
          >
            <Icon name={p.icon} className="text-lg text-primary-deep" />
            {p.label}
          </button>
        ))}
      </div>

      <Link to="/home" className="mt-8 text-center text-sm font-bold text-primary-deep">
        Continue as guest
      </Link>

      <p className="mt-auto pt-8 text-center text-[11px] text-muted-foreground">
        By continuing you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
