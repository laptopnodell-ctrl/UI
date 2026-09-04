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
        content: "Sign in with your mobile number to start ordering from Vino Tasty Hub.",
      },
      { property: "og:title", content: "Log in — Vino Tasty Hub" },
      { property: "og:description", content: "Sign in with your mobile number to start ordering." },
    ],
  }),
  component: Login,
});

function Login() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const valid = /^\d{10}$/.test(phone);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background px-6 pt-12 pb-10">
      {/* Centered Brand & Header Block */}
      <div className="flex flex-col items-center text-center">
        <img src={img.logo} alt="Vino Tasty Hub" className="h-16 w-auto object-contain mix-blend-multiply" />
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-foreground">
          Welcome to Vino Tasty Hub
        </h1>
        <p className="mt-2 text-sm font-medium text-muted-foreground max-w-xs leading-relaxed">
          Sign in with your mobile number to start ordering.
        </p>
      </div>

      <label className="mt-8 block text-xs font-bold text-muted-foreground uppercase tracking-wider">
        Mobile number
      </label>
      <div className="vino-card mt-2 flex items-center gap-2.5 px-4 py-3.5 border-border/80">
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
        className="vino-cta vino-cta-press mt-6 py-3.5 disabled:opacity-50"
      >
        CONTINUE
      </button>

      <div className="my-7 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-semibold text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        onClick={() => toast.info("Google sign-in coming soon")}
        className="vino-card flex items-center justify-center gap-2.5 py-3.5 text-sm font-bold text-foreground hover:border-primary/40 transition-colors"
      >
        <Icon name="mail" className="text-xl text-primary-deep" />
        Google
      </button>

      <Link to="/home" className="mt-8 text-center text-sm font-bold text-primary-deep hover:underline">
        Continue as guest
      </Link>

      <p className="mt-auto pt-8 text-center text-[11px] text-muted-foreground">
        By continuing you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
