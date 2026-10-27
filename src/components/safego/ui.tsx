import type { ReactNode } from "react";
import { ArrowLeft, Home, Clock, User, X, Star, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function TopBar({ title, onBack, right }: { title?: string; onBack?: () => void; right?: ReactNode }) {
  return (
    <div className="sticky top-0 z-20 flex items-center gap-3 bg-background/90 px-4 py-3 backdrop-blur">
      {onBack && (
        <button onClick={onBack} aria-label="Back" className="grid h-10 w-10 place-items-center rounded-full bg-card shadow-card">
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      <h1 className="flex-1 text-lg font-bold">{title}</h1>
      {right}
    </div>
  );
}

export function SafeGoMark({ inverted }: { inverted?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("rounded-md px-1.5 py-0.5 text-xs font-extrabold", inverted ? "bg-primary-foreground text-primary-ink" : "bg-primary text-primary-foreground")}>PickMe</span>
      <span className={cn("text-base font-extrabold tracking-tight", inverted ? "text-primary-foreground" : "text-foreground")}>SafeGo</span>
    </div>
  );
}

export function SampleTag({ children = "Sample", className }: { children?: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-dashed border-muted-foreground/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground", className)}>
      {children}
    </span>
  );
}

export function Card({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  const C = onClick ? "button" : "div";
  return (
    <C onClick={onClick} className={cn("block w-full rounded-2xl bg-card p-4 text-left shadow-card", className)}>
      {children}
    </C>
  );
}

export function CTA({ children, onClick, disabled, variant = "primary", className }: { children: ReactNode; onClick?: () => void; disabled?: boolean; variant?: "primary" | "dark" | "outline"; className?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold transition active:scale-[0.98] disabled:opacity-40",
        variant === "primary" && "bg-primary text-primary-foreground shadow-cta",
        variant === "dark" && "bg-secondary text-secondary-foreground",
        variant === "outline" && "border-2 border-border bg-card text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Chip({ active, children, onClick }: { active?: boolean; children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-2 text-sm font-semibold transition",
        active ? "border-primary bg-primary-soft text-primary-ink" : "border-border bg-card text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function MapPreview({ height = 160, route = true, progress, label }: { height?: number; route?: boolean; progress?: number; label?: string }) {
  const p = progress ?? 0;
  const carX = 40 + (300 - 40) * p;
  const carY = 130 - 90 * p + Math.sin(p * Math.PI) * -10;
  return (
    <div className="relative overflow-hidden rounded-2xl bg-map" style={{ height }}>
      <svg viewBox="0 0 340 170" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <path d="M0 150 Q 80 120 120 170 L0 170 Z" className="fill-map-water" />
        <g className="stroke-map-road" strokeWidth="9" fill="none" strokeLinecap="round">
          <path d="M-10 60 L350 30" />
          <path d="M60 -10 L90 180" />
          <path d="M200 -10 L230 180" />
          <path d="M-10 120 L350 110" />
          <path d="M270 -10 L320 180" strokeWidth="5" />
          <path d="M130 -10 L150 180" strokeWidth="5" />
        </g>
        {route && (
          <>
            <path d="M40 130 C 100 120, 150 70, 210 75 S 280 50, 300 40" fill="none" className="stroke-secondary" strokeWidth="5" strokeLinecap="round" />
            <path d="M40 130 C 100 120, 150 70, 210 75 S 280 50, 300 40" fill="none" className="stroke-primary route-dash" strokeWidth="5" strokeDasharray="10 10" strokeLinecap="round" />
            <circle cx="40" cy="130" r="8" className="fill-card stroke-secondary" strokeWidth="4" />
            <circle cx="300" cy="40" r="9" className="fill-primary stroke-secondary" strokeWidth="3" />
            <circle cx="300" cy="40" r="3.5" className="fill-card" />
          </>
        )}
        {progress !== undefined && (
          <g transform={`translate(${carX} ${carY})`}>
            <circle r="14" className="fill-primary pulse-ring" style={{ transformOrigin: "center", transformBox: "fill-box" }} />
            <circle r="10" className="fill-primary stroke-secondary" strokeWidth="3" />
          </g>
        )}
        {!route && (
          <g transform="translate(170 85)">
            <circle r="16" className="fill-primary pulse-ring" style={{ transformOrigin: "center", transformBox: "fill-box" }} />
            <circle r="8" className="fill-primary stroke-secondary" strokeWidth="3" />
          </g>
        )}
      </svg>
      {label && (
        <div className="absolute left-3 top-3 rounded-full bg-card/95 px-3 py-1 text-xs font-semibold shadow-card">{label}</div>
      )}
      <SampleTag className="absolute bottom-2 right-2 bg-card/90">Illustrative map</SampleTag>
    </div>
  );
}

export function DriverAvatar({ initials, size = 56 }: { initials: string; size?: number }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div className="grid h-full w-full place-items-center rounded-full bg-secondary text-lg font-bold text-secondary-foreground">{initials}</div>
      <ShieldCheck className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-card p-0.5 text-success" />
    </div>
  );
}

export function Rating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold">
      <Star className="h-4 w-4 fill-primary text-primary-ink" />
      {value.toFixed(1)}
    </span>
  );
}

export function RouteLines({ from, to }: { from: string; to: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center pt-1.5">
        <span className="h-2.5 w-2.5 rounded-full border-2 border-secondary" />
        <span className="my-1 w-px flex-1 bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
      </div>
      <div className="min-w-0 flex-1 space-y-3 text-sm">
        <div><div className="text-xs text-muted-foreground">Driver meets you at</div><div className="truncate font-semibold">{from}</div></div>
        <div><div className="text-xs text-muted-foreground">Your car goes to</div><div className="truncate font-semibold">{to}</div></div>
      </div>
    </div>
  );
}

export type Tab = "home" | "activity" | "account";

export function BottomNav({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  const items = [
    { id: "home" as const, label: "Home", Icon: Home },
    { id: "activity" as const, label: "Activity", Icon: Clock },
    { id: "account" as const, label: "Account", Icon: User },
  ];
  return (
    <nav className="grid grid-cols-3 border-t border-border bg-card pb-5 pt-2">
      {items.map(({ id, label, Icon }) => (
        <button key={id} onClick={() => onTab(id)} className={cn("flex flex-col items-center gap-0.5 text-xs font-semibold", tab === id ? "text-primary-ink" : "text-muted-foreground")}>
          <Icon className="h-5 w-5" />
          {label}
        </button>
      ))}
    </nav>
  );
}

export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-end bg-secondary/50" onClick={onClose}>
      <div className="animate-rise w-full rounded-t-3xl bg-card p-5 pb-8" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full bg-muted"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export const inputCls = "h-12 w-full rounded-xl border border-input bg-card px-3.5 text-sm font-medium outline-none placeholder:text-muted-foreground focus:border-primary";
