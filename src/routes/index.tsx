import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Flame,
  Star,
  Play,
  Home,
  Dumbbell,
  Coffee,
  BarChart3,
  MoreHorizontal,
  ChevronRight,
  Quote,
  Moon,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Areviax — Today's Training Dashboard" },
      {
        name: "description",
        content:
          "Your session, macros, streak and recovery notes in a single glance. Built for lifters who train on purpose.",
      },
      { property: "og:title", content: "Areviax — Today's Training Dashboard" },
      {
        property: "og:description",
        content:
          "Your session, macros, streak and recovery notes in a single glance. Built for lifters who train on purpose.",
      },
    ],
  }),
  component: HomeScreen,
});

/* ---------- primitives ---------- */

function Ring({
  value,
  max,
  color = "primary",
  size = 92,
  children,
}: {
  value: number;
  max: number;
  color?: "primary" | "fuel";
  size?: number;
  children: React.ReactNode;
}) {
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(value / max, 1) : 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          className={
            color === "fuel"
              ? "stroke-fuel transition-[stroke-dashoffset] duration-700"
              : "stroke-primary transition-[stroke-dashoffset] duration-700"
          }
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        {children}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  ringValue,
  ringMax,
  tone = "primary",
}: {
  label: string;
  value: string;
  sub?: string;
  ringValue: number;
  ringMax: number;
  tone?: "primary" | "fuel";
}) {
  return (
    <div className="surface flex flex-col items-center gap-3 rounded-2xl p-3">
      <Ring value={ringValue} max={ringMax} color={tone}>
        <span className="font-mono text-lg font-semibold tabular-nums">{value}</span>
        {sub ? (
          <span className="mt-1 font-mono text-[11px] text-muted-foreground">{sub}</span>
        ) : null}
      </Ring>
      <span
        className={
          tone === "fuel"
            ? "label-eyebrow text-fuel"
            : "label-eyebrow text-primary"
        }
      >
        {label}
      </span>
    </div>
  );
}

function MacroBar({
  label,
  value,
  target,
  unit = "g",
}: {
  label: string;
  value: number;
  target: number;
  unit?: string;
}) {
  const pct = Math.min((value / target) * 100, 100);
  return (
    <div className="flex items-center gap-3">
      <span className="label-eyebrow w-12 shrink-0">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-fuel transition-[width] duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-20 shrink-0 text-right font-mono text-[11px] text-muted-foreground tabular-nums">
        {value}/{target}
        {unit}
      </span>
    </div>
  );
}

/* ---------- screen ---------- */

const NAV = [
  { icon: Home, label: "Home" },
  { icon: Dumbbell, label: "Build" },
  { icon: Coffee, label: "Fuel" },
  { icon: BarChart3, label: "Progress" },
  { icon: MoreHorizontal, label: "More" },
];

function HomeScreen() {
  const [active, setActive] = useState("Home");

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 px-5 pb-3 pt-5 backdrop-blur-xl">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl leading-none">Home</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Good afternoon, Sam. Push day.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full border border-primary-soft bg-primary-soft/40 px-2.5 py-1 text-xs font-semibold text-primary">
              <Flame className="size-3.5" /> 2
            </span>
            <span className="flex items-center gap-1 rounded-full border border-border-strong bg-muted px-2.5 py-1 text-xs font-semibold text-xp">
              <Star className="size-3.5" /> 415
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-4 px-5 pb-32 pt-4">
        {/* Primary action */}
        <section className="surface relative overflow-hidden rounded-3xl p-5">
          <span className="label-eyebrow text-primary">Today · Session 2 of 4</span>
          <h2 className="mt-1 text-4xl leading-none">Push Upper</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            6 exercises · 48 min est. · last done 4 days ago
          </p>

          <button className="ember mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold uppercase tracking-widest transition-transform active:scale-[0.98]">
            <Play className="size-5 fill-current" />
            Start session
          </button>

          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="label-eyebrow">This week&apos;s volume</span>
              <span className="font-mono text-xs text-foreground tabular-nums">
                12,400 / 18,000 kg
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[69%] rounded-full bg-primary" />
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="surface rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl leading-none">Today&apos;s overview</h3>
            <button className="flex items-center gap-0.5 text-xs font-semibold text-muted-foreground">
              Log food <ChevronRight className="size-3.5" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            <MetricCard label="Sessions" value="1/4" ringValue={1} ringMax={4} />
            <MetricCard
              label="Calories"
              value="1,180"
              sub="/ 3,345"
              ringValue={1180}
              ringMax={3345}
            />
            <MetricCard
              label="Protein"
              value="86g"
              sub="/ 141g"
              ringValue={86}
              ringMax={141}
              tone="fuel"
            />
          </div>

          <div className="mt-5 space-y-3">
            <MacroBar label="Carbs" value={210} target={380} />
            <MacroBar label="Fat" value={44} target={95} />
          </div>
        </section>

        {/* Coach note */}
        <section className="surface rounded-3xl p-5">
          <div className="flex items-start gap-3">
            <Quote className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <span className="label-eyebrow text-primary">Today&apos;s perspective</span>
              <p className="mt-2 text-base font-semibold italic leading-snug">
                &ldquo;Nobody ever regretted the workout they finished.&rdquo;
              </p>
              <p className="mt-2 text-xs font-semibold text-primary">— Areviax</p>
            </div>
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <span className="label-eyebrow text-fuel">This week&apos;s assessment</span>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              You logged one of four sessions and protein is trending 30g under target.
              Hit today&apos;s push day and you&apos;re back on pace.
            </p>
            <button className="mt-3 flex items-center gap-0.5 text-xs font-semibold text-foreground">
              Read full breakdown <ChevronRight className="size-3.5" />
            </button>
          </div>
        </section>

        {/* Recovery */}
        <section className="rounded-3xl border border-border bg-card/60 p-5">
          <div className="flex items-center gap-2">
            <Moon className="size-4 text-fuel" />
            <span className="label-eyebrow text-fuel">Recovery focus</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Legs are 36 hours post-session — satellite cells are still fusing new
            contractile protein. Keep protein high and sleep long; growth happens here.
          </p>
        </section>
      </main>

      {/* Bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-border bg-background/90 px-4 pb-5 pt-2 backdrop-blur-xl">
        <ul className="flex items-end justify-between">
          {NAV.map(({ icon: Icon, label }) => {
            const isActive = active === label;
            return (
              <li key={label} className="flex-1">
                <button
                  onClick={() => setActive(label)}
                  className="flex w-full flex-col items-center gap-1 py-1"
                >
                  <Icon
                    className={
                      isActive
                        ? "size-5 text-primary"
                        : "size-5 text-muted-foreground"
                    }
                  />
                  <span
                    className={
                      isActive
                        ? "text-[11px] font-semibold text-primary"
                        : "text-[11px] font-medium text-muted-foreground"
                    }
                  >
                    {label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
