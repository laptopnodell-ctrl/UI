import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/otp")({
  validateSearch: (search: Record<string, unknown>) => ({
    phone: typeof search["phone"] === "string" ? (search["phone"] as string) : "",
  }),

  head: () => ({
    meta: [
      { title: "Verify OTP — Vino Tasty Hub" },
      { name: "description", content: "Enter the 4-digit code we sent to your mobile number." },
      { property: "og:title", content: "Verify OTP — Vino Tasty Hub" },
      { property: "og:description", content: "Confirm your number to finish signing in." },
    ],
  }),
  component: Otp,
});

function Otp() {
  const { phone } = Route.useSearch();
  const navigate = useNavigate();
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [seconds, setSeconds] = useState(30);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (seconds === 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const complete = digits.every((d) => d !== "");

  const set = (i: number, v: string) => {
    const clean = v.replace(/\D/g, "").slice(-1);
    setDigits((prev) => prev.map((d, idx) => (idx === i ? clean : d)));
    if (clean && i < 3) refs.current[i + 1]?.focus();
  };

  const verify = () => {
    localStorage.setItem("vino-onboarded", "1");
    toast.success("Number verified");
    navigate({ to: "/home" });
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background px-6 pt-16 pb-10">
      <h1 className="text-[26px] font-extrabold text-foreground">Verify your number</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We sent a 4-digit code to <span className="font-bold text-foreground">+91 {phone || "•••••"}</span>
      </p>

      <div className="mt-10 flex justify-between gap-3">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={d}
            onChange={(e) => set(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !d && i > 0) refs.current[i - 1]?.focus();
            }}
            inputMode="numeric"
            aria-label={`Digit ${i + 1}`}
            className="vino-card h-16 w-full text-center text-2xl font-extrabold text-foreground outline-none focus:border-primary"
          />
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        {seconds > 0 ? (
          <span>
            Resend code in <span className="font-bold text-foreground">0:{String(seconds).padStart(2, "0")}</span>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => {
              setSeconds(30);
              toast.success("New code sent");
            }}
            className="font-bold text-primary-deep"
          >
            Resend code
          </button>
        )}
      </div>

      <button
        type="button"
        disabled={!complete}
        onClick={verify}
        className="vino-cta vino-cta-press mt-8 disabled:opacity-50"
      >
        VERIFY & CONTINUE
      </button>
    </div>
  );
}
