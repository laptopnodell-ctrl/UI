import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function Icon({
  name,
  className = "",
  filled = false,
}: {
  name: string;
  className?: string;
  filled?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined ${filled ? "icon-filled" : ""} ${className}`}
    >
      {name}
    </span>
  );
}

export function Screen({
  children,
  padBottom = true,
}: {
  children: ReactNode;
  padBottom?: boolean;
}) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-background">
      <div className={padBottom ? "pb-28" : "pb-6"}>{children}</div>
    </div>
  );
}

export function TopBar({
  title,
  subtitle,
  back,
  right,
  sticky = true,
}: {
  title: string;
  subtitle?: string;
  back?: string;
  right?: ReactNode;
  sticky?: boolean;
}) {
  return (
    <header
      className={`${sticky ? "sticky top-0 z-30" : ""} vino-surface-sticky border-b border-border/60`}
    >
      <div className="flex items-center gap-2 px-4 py-3">
        {back ? (
          <Link
            to={back}
            aria-label="Go back"
            className="grid size-9 place-items-center rounded-full bg-muted text-primary-deep"
          >
            <Icon name="arrow_back" className="text-xl" />
          </Link>
        ) : null}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold text-foreground">{title}</h1>
          {subtitle ? (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {right}
      </div>
    </header>
  );
}

export function SectionTitle({
  title,
  action,
  to,
}: {
  title: string;
  action?: string;
  to?: string;
}) {
  return (
    <div className="mb-3 flex items-end justify-between px-4">
      <h2 className="text-[17px] font-bold text-foreground">{title}</h2>
      {action && to ? (
        <Link to={to} className="text-xs font-bold text-primary-deep">
          {action}
        </Link>
      ) : null}
    </div>
  );
}

export function VegBadge({ veg }: { veg: boolean }) {
  return (
    <span
      className={`grid size-4 shrink-0 place-items-center rounded-[3px] border ${
        veg ? "border-veg" : "border-nonveg"
      }`}
      aria-label={veg ? "Vegetarian" : "Non vegetarian"}
    >
      <span className={`size-2 rounded-full ${veg ? "bg-veg" : "bg-nonveg"}`} />
    </span>
  );
}

export function Rating({ value, reviews }: { value: number; reviews?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
      <Icon name="star" filled className="text-sm text-primary" />
      {value.toFixed(1)}
      {reviews ? <span className="font-normal">({reviews})</span> : null}
    </span>
  );
}

export function Chip({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  icon?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`vino-chip ${active ? "vino-chip-active" : ""}`}
    >
      {icon ? <Icon name={icon} className="text-base" /> : null}
      {label}
    </button>
  );
}

export function Stepper({
  qty,
  onChange,
  small = false,
}: {
  qty: number;
  onChange: (n: number) => void;
  small?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-primary bg-secondary ${
        small ? "px-1 py-0.5" : "px-1.5 py-1"
      }`}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(qty - 1)}
        className="grid size-6 place-items-center rounded-full text-primary-deep"
      >
        <Icon name="remove" className="text-base" />
      </button>
      <span className="min-w-5 text-center text-sm font-bold text-primary-deep">{qty}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(qty + 1)}
        className="grid size-6 place-items-center rounded-full text-primary-deep"
      >
        <Icon name="add" className="text-base" />
      </button>
    </div>
  );
}

export function StickyBar({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-border/60 bg-card/95 px-4 pt-3 pb-5 backdrop-blur">
      {children}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  text,
  ctaLabel,
  ctaTo,
}: {
  icon: string;
  title: string;
  text: string;
  ctaLabel?: string;
  ctaTo?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-8 py-20 text-center">
      <span className="grid size-20 place-items-center rounded-full bg-secondary">
        <Icon name={icon} className="text-4xl text-primary-deep" />
      </span>
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground">{text}</p>
      {ctaLabel && ctaTo ? (
        <Link to={ctaTo} className="vino-cta vino-cta-press mt-3 w-auto px-8">
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function Row({
  icon,
  label,
  detail,
  to,
  onClick,
  danger,
  right,
}: {
  icon: string;
  label: string;
  detail?: string;
  to?: string;
  onClick?: () => void;
  danger?: boolean;
  right?: ReactNode;
}) {
  const inner = (
    <>
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-full ${
          danger ? "bg-destructive/10 text-destructive" : "bg-secondary text-primary-deep"
        }`}
      >
        <Icon name={icon} className="text-lg" />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span
          className={`block truncate text-sm font-semibold ${
            danger ? "text-destructive" : "text-foreground"
          }`}
        >
          {label}
        </span>
        {detail ? (
          <span className="block truncate text-xs text-muted-foreground">{detail}</span>
        ) : null}
      </span>
      {right ?? <Icon name="chevron_right" className="text-muted-foreground" />}
    </>
  );
  const cls = "flex w-full items-center gap-3 px-4 py-3";
  if (to)
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    );
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}
