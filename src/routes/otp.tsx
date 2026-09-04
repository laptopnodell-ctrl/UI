import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/vino/ui";
import { img } from "@/lib/vino-images";

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
  const [seconds, setSeconds] = useState(21);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  // Format phone display nicely (e.g., +91 94485 43554)
  const formattedPhone = phone
    ? phone.length === 10
      ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
      : `+91 ${phone}`
    : "+91 94485 43554";

  useEffect(() => {
    if (seconds === 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const complete = digits.every((d) => d !== "");

  const handleDigitChange = (index: number, val: string) => {
    // Clean numeric input
    const clean = val.replace(/\D/g, "");
    if (!clean) {
      setDigits((prev) => prev.map((d, i) => (i === index ? "" : d)));
      return;
    }

    // Support paste or single digit
    if (clean.length > 1) {
      const chars = clean.slice(0, 4).split("");
      const next = [...digits];
      chars.forEach((c, idx) => {
        if (idx < 4) next[idx] = c;
      });
      setDigits(next);
      const nextFocus = Math.min(chars.length, 3);
      refs.current[nextFocus]?.focus();
      return;
    }

    const nextChar = clean.slice(-1);
    setDigits((prev) => prev.map((d, i) => (i === index ? nextChar : d)));
    if (index < 3) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        refs.current[index - 1]?.focus();
      }
    } else if (e.key === "Enter" && complete) {
      verify();
    }
  };

  const handleResend = () => {
    setSeconds(21);
    toast.success("New 4-digit code sent to your mobile number");
  };

  const verify = () => {
    localStorage.setItem("vino-onboarded", "1");
    toast.success("Number verified successfully!");
    const savedAddress = localStorage.getItem("vino_default_address");
    navigate({ to: savedAddress ? "/home" : "/location" });
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background px-6 pt-8 pb-8 text-foreground selection:bg-primary/30">
      {/* Top Bar: Back button & Centered Logo */}
      <div className="relative flex items-center justify-between">
        <Link
          to="/login"
          aria-label="Back to login"
          className="grid size-10 place-items-center rounded-full border border-border/80 bg-card text-foreground transition-all hover:bg-secondary active:scale-95 shadow-xs"
        >
          <Icon name="arrow_back" className="text-xl" />
        </Link>

        {/* Small Vino Logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <img
            src={img.logo}
            alt="Vino Tasty Hub"
            className="h-10 w-auto object-contain mix-blend-multiply"
          />
        </div>

        {/* Empty balance spacer */}
        <div className="size-10" />
      </div>

      {/* Main Heading Block */}
      <div className="mt-6 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          Verify your number
        </h1>
        <p className="mt-2.5 text-sm font-medium text-muted-foreground">
          We sent a 4-digit code to
        </p>
        <div className="mt-1 flex items-center justify-center gap-2">
          <span className="text-sm font-bold text-foreground tracking-wide">{formattedPhone}</span>
          <Link
            to="/login"
            className="text-xs font-bold text-primary-deep hover:underline transition-colors ml-0.5"
          >
            Edit
          </Link>
        </div>
      </div>

      {/* OTP Input Section */}
      <div className="mt-7 flex justify-center gap-3.5">
        {digits.map((digit, i) => {
          const isFilled = digit !== "";
          return (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              autoFocus={i === 0}
              aria-label={`Digit ${i + 1}`}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`h-15 w-14 rounded-[18px] border text-center text-2xl font-extrabold transition-all outline-none shadow-xs ${
                isFilled
                  ? "border-primary/80 bg-card text-foreground"
                  : "border-border/90 bg-card text-foreground"
              } focus:border-primary focus:bg-amber-50/40 focus:ring-4 focus:ring-primary/15`}
            />
          );
        })}
      </div>

      {/* Resend Section */}
      <div className="mt-5 text-center">
        <p className="text-xs font-medium text-muted-foreground">Didn’t receive the code?</p>
        <div className="mt-1.5 min-h-6 flex items-center justify-center">
          {seconds > 0 ? (
            <p className="text-xs font-semibold text-muted-foreground">
              Resend in{" "}
              <span className="font-bold text-foreground">
                00:{String(seconds).padStart(2, "0")}
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-xs font-bold text-primary-deep hover:underline transition-all active:scale-95"
            >
              Resend Code
            </button>
          )}
        </div>
      </div>

      {/* Security / Trust Card */}
      <div className="mt-8 rounded-[18px] border border-border/80 bg-card p-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-primary-deep">
            <Icon name="shield" filled className="text-lg text-primary-deep" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-foreground">Secure sign in</h2>
            <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
              Your mobile number helps us keep your orders, addresses and account secure.
            </p>
          </div>
        </div>
      </div>

      {/* Flexible spacer to push CTA down */}
      <div className="flex-1 min-h-6" />

      {/* Primary CTA */}
      <button
        type="button"
        disabled={!complete}
        onClick={verify}
        className={`vino-cta-press flex h-14 w-full items-center justify-center gap-2 rounded-[18px] font-extrabold text-[15px] tracking-wide transition-all shadow-md ${
          complete
            ? "bg-primary text-foreground shadow-primary/20 hover:brightness-105 active:scale-[0.98]"
            : "bg-primary/40 text-foreground/50 cursor-not-allowed shadow-none"
        }`}
      >
        <span>VERIFY & CONTINUE</span>
        <Icon name="arrow_forward" className="text-lg" />
      </button>

      {/* Footer */}
      <p className="mt-3 text-center text-[11px] font-medium text-muted-foreground">
        By continuing, you agree to our Terms & Privacy Policy.
      </p>
    </div>
  );
}
