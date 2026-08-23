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
  ArrowUpRight,
  Moon,
  Clock,
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

/* ---------- data ---------- */

const NAV = [
  { icon: Home, label: "Home" },
  { icon: Dumbbell, label: "Build" },
  { icon: Coffee, label: "Fuel" },
  { icon: BarChart3, label: "Progress" },
  { icon: MoreHorizontal, label: "More" },
];

const WEEK = [
  { d: "M", done: true },
  { d: "T", done: false },
  { d: "W", done: false, today: true },
  { d: "T", done: false },
  { d: "F", done: false },
  { d: "S", done: false },
  { d: "S", done: false },
];

/* ---------- primitives ---------- */

function Rail({
  label,
  value,
  target,
  unit = "g",
  tone = "fuel",
}: {
  label: string;
  value: number;
  target: number;
  unit?: string;
  tone?: "fuel" | "primary";
}) {
  const pct = Math.min((value / target) * 100, 100);
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="label-eyebrow">{label}</span>
        <span className="font-mono text-xs text-foreground tabular-nums">
          {value.toLocaleString()}
          <span className="text-muted-foreground">
            /{target.toLocaleString()}
            {unit}
          </span>
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={
            tone === "fuel"
              ? "h-full rounded-full bg-fuel transition-[width] duration-700"
              : "h-full rounded-full bg-primary transition-[width] duration-700"
          }
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  pct,
  tone = "primary",
}: {
  label: string;
  value: string;
  unit?: string;
  pct: number;
  tone?: "primary" | "fuel" | "xp";
}) {
  const bar =
    tone === "fuel" ? "bg-fuel" : tone === "xp" ? "bg-xp" : "bg-primary";
  const txt =
    tone === "fuel" ? "text-fuel" : tone === "xp" ? "text-xp" : "text-primary";
  return (
    <div className="flex flex-col gap-3 p-4">
      <span className="label-eyebrow">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="stat-huge">{value}</span>
        {unit ? (
          <span className={`font-mono text-[11px] ${txt}`}>{unit}</span>
        ) : null}
      </div>
      <div className="h-[3px] overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${bar} transition-[width] duration-700`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}

/* ---------- screen ---------- */

function HomeScreen() {
  const [active, setActive] = useState("Home");

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      {/* HERO */}
      <header className="ember-wash grain relative overflow-hidden px-5 pb-8 pt-6">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="label-eyebrow text-foreground/70">
              Wed · Week 3
            </span>
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
                <Flame className="size-3.5" /> 2
              </span>
              <span className="flex items-center gap-1 rounded-full border border-border-strong px-2.5 py-1 text-[11px] font-bold text-xp">
                <Star className="size-3.5" /> 415
              </span>
            </div>
          </div>

          <p className="mt-7 label-eyebrow text-primary">Session 02 / 04</p>
          <h1 className="display-hero mt-2">
            Push
            <br />
            <span className="text-outline">Upper</span>
          </h1>

          <div className="mt-4 flex items-center gap-4 font-mono text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Dumbbell className="size-3.5" /> 6 lifts
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" /> 48 min
            </span>
            <span>last · 4d ago</span>
          </div>

          {/* week strip */}
          <div className="mt-6 flex gap-1.5">
            {WEEK.map((d, i) => (
              <div
                key={i}
                className={[
                  "flex h-9 flex-1 flex-col items-center justify-center rounded-lg border text-[10px] font-bold uppercase",
                  d.done
                    ? "border-primary bg-primary/20 text-primary"
                    : d.today
                      ? "border-border-strong bg-elevated text-foreground"
                      : "border-border text-muted-foreground",
                ].join(" ")}
              >
                {d.d}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-3 px-5 pb-36">
        {/* volume */}
        <section className="surface rounded-3xl p-5">
          <Rail
            label="Weekly volume"
            value={12400}
            target={18000}
            unit="kg"
            tone="primary"
          />
          <p className="mt-3 text-xs text-muted-foreground">
            69% of target with 3 sessions left — you&apos;re on pace.
          </p>
        </section>

        {/* stats grid */}
        <section className="hairline-grid grid grid-cols-3 bg-card/60">
          <Stat label="Sessions" value="1" unit="/4" pct={25} />
          <Stat label="Kcal" value="1.2" unit="k/3.3k" pct={35} tone="xp" />
          <Stat label="Protein" value="86" unit="/141g" pct={61} tone="fuel" />
        </section>

        {/* fuel */}
        <section className="surface rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl leading-none">Fuel</h2>
            <button className="flex items-center gap-1 rounded-full border border-border-strong px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider">
              Log food <ArrowUpRight className="size-3.5" />
            </button>
          </div>
          <div className="mt-5 space-y-4">
            <Rail label="Protein" value={86} target={141} />
            <Rail label="Carbs" value={210} target={380} />
            <Rail label="Fat" value={44} target={95} />
          </div>
        </section>

        {/* quote */}
        <section className="ember relative overflow-hidden rounded-3xl p-6">
          <span className="pointer-events-none absolute -right-2 -top-8 font-display text-[8rem] leading-none opacity-20">
            &ldquo;
          </span>
          <p className="relative text-2xl font-bold italic leading-tight">
            Nobody ever regretted the workout they finished.
          </p>
          <p className="relative mt-3 text-[11px] font-bold uppercase tracking-[0.16em] opacity-70">
            Areviax · Daily
          </p>
        </section>

        {/* recovery */}
        <section className="rounded-3xl border border-border p-5">
          <div className="flex items-center gap-2">
            <Moon className="size-4 text-fuel" />
            <span className="label-eyebrow text-fuel">Recovery</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Legs are 36 hours out — new contractile protein is still fusing. Keep
            protein high, sleep long. Growth happens here.
          </p>
        </section>
      </main>

      {/* START bar + nav */}
      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md">
        <div className="px-5 pb-2">
          <button className="ember grain flex w-full items-center justify-between rounded-2xl px-5 py-4 transition-transform active:scale-[0.98]">
            <span className="text-lg font-extrabold uppercase tracking-[0.18em]">
              Start session
            </span>
            <Play className="size-5 fill-current" />
          </button>
        </div>
        <nav className="border-t border-border bg-background/90 px-3 pb-5 pt-2 backdrop-blur-xl">
          <ul className="flex items-end justify-between">
            {NAV.map(({ icon: Icon, label }) => {
              const isActive = active === label;
              return (
                <li key={label} className="flex-1">
                  <button
                    onClick={() => setActive(label)}
                    className="flex w-full flex-col items-center gap-1.5 py-1"
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
                          ? "h-1 w-1 rounded-full bg-primary"
                          : "h-1 w-1 rounded-full bg-transparent"
                      }
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
