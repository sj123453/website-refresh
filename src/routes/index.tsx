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
  TrendingUp,
  Trophy,
  Plus,
  Check,
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

const TREND = [9.4, 11.2, 10.8, 13.6, 12.9, 15.1, 16.4, 12.4];

const LIFTS = [
  { name: "Incline Bench", scheme: "4 × 6", load: "72.5 kg", pr: true },
  { name: "Overhead Press", scheme: "4 × 8", load: "45 kg" },
  { name: "Weighted Dip", scheme: "3 × 10", load: "+20 kg" },
  { name: "Cable Fly", scheme: "3 × 12", load: "17.5 kg" },
  { name: "Lateral Raise", scheme: "4 × 15", load: "12 kg" },
  { name: "Triceps Rope", scheme: "3 × 15", load: "27 kg" },
];

const QUICK_FOOD = [
  { name: "Whey shake", p: 28 },
  { name: "Chicken 150g", p: 46 },
  { name: "Greek yogurt", p: 20 },
  { name: "4 eggs", p: 24 },
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

function Section({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <section className={`rise ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </section>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <div className="flex h-14 items-end gap-1.5">
      {data.map((v, i) => {
        const last = i === data.length - 1;
        return (
          <div key={i} className="flex-1">
            <div
              className={
                last
                  ? "w-full rounded-t-sm bg-primary"
                  : "w-full rounded-t-sm bg-border-strong"
              }
              style={{ height: `${(v / max) * 56}px` }}
            />
          </div>
        );
      })}
    </div>
  );
}

/* ---------- screen ---------- */

function HomeScreen() {
  const [active, setActive] = useState("Home");
  const [logged, setLogged] = useState<string[]>([]);

  const toggleFood = (name: string) =>
    setLogged((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );

  const bonusProtein = QUICK_FOOD.filter((f) => logged.includes(f.name)).reduce(
    (sum, f) => sum + f.p,
    0,
  );
  const protein = 86 + bonusProtein;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      {/* HERO */}
      <header className="ember-wash grain relative overflow-hidden px-5 pb-8 pt-6">
        <span className="ghost-numeral absolute -right-3 top-16">02</span>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="label-eyebrow pulse-dot flex items-center text-foreground/70">
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

          <p className="label-eyebrow mt-7 text-primary">Session 02 / 04</p>
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
                  "flex h-9 flex-1 items-center justify-center rounded-lg border text-[10px] font-bold uppercase",
                  d.done
                    ? "border-primary bg-primary/20 text-primary"
                    : d.today
                      ? "border-border-strong bg-elevated text-foreground"
                      : "border-border text-muted-foreground",
                ].join(" ")}
              >
                {d.done ? <Check className="size-3.5" /> : d.d}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-3 px-5 pb-36">
        {/* volume + trend */}
        <Section delay={40} className="surface rounded-3xl p-5">
          <Rail
            label="Weekly volume"
            value={12400}
            target={18000}
            unit="kg"
            tone="primary"
          />
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <span className="label-eyebrow">8-week trend</span>
              <span className="flex items-center gap-1 font-mono text-[11px] text-primary">
                <TrendingUp className="size-3.5" /> +32%
              </span>
            </div>
            <div className="mt-2">
              <Sparkline data={TREND} />
            </div>
          </div>
        </Section>

        {/* stats grid */}
        <Section delay={80} className="hairline-grid grid grid-cols-3 bg-card/60">
          <Stat label="Sessions" value="1" unit="/4" pct={25} />
          <Stat label="Kcal" value="1.2" unit="k/3.3k" pct={35} tone="xp" />
          <Stat
            label="Protein"
            value={String(protein)}
            unit="/141g"
            pct={(protein / 141) * 100}
            tone="fuel"
          />
        </Section>

        {/* today's lifts */}
        <Section delay={120} className="surface rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl leading-none">The plan</h2>
            <span className="font-mono text-[11px] text-muted-foreground">
              24 sets
            </span>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {LIFTS.map((l, i) => (
              <li key={l.name} className="flex items-center gap-3 py-3">
                <span className="w-5 font-mono text-[11px] text-muted-foreground tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {l.name}
                    {l.pr ? (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-xp/15 px-1.5 py-0.5 align-middle text-[9px] font-bold uppercase tracking-wider text-xp">
                        <Trophy className="size-2.5" /> PR
                      </span>
                    ) : null}
                  </p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {l.scheme} · {l.load}
                  </p>
                </div>
                <div className="h-6 w-px bg-border" />
                <span className="label-eyebrow text-primary">Go</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* fuel */}
        <Section delay={160} className="surface rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl leading-none">Fuel</h2>
            <button className="flex items-center gap-1 rounded-full border border-border-strong px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider">
              Log food <ArrowUpRight className="size-3.5" />
            </button>
          </div>
          <div className="mt-5 space-y-4">
            <Rail label="Protein" value={protein} target={141} />
            <Rail label="Carbs" value={210} target={380} />
            <Rail label="Fat" value={44} target={95} />
          </div>

          <p className="label-eyebrow mt-5">One tap</p>
          <div className="scroll-row mt-2 -mx-1 px-1">
            {QUICK_FOOD.map((f) => {
              const on = logged.includes(f.name);
              return (
                <button
                  key={f.name}
                  onClick={() => toggleFood(f.name)}
                  className={[
                    "flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition-colors",
                    on
                      ? "border-fuel bg-fuel/15 text-fuel"
                      : "border-border-strong text-foreground",
                  ].join(" ")}
                >
                  {on ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
                  {f.name}
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {f.p}p
                  </span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* quote */}
        <Section delay={200} className="ember relative overflow-hidden rounded-3xl p-6">
          <span className="pointer-events-none absolute -right-2 -top-8 font-display text-[8rem] leading-none opacity-20">
            &ldquo;
          </span>
          <p className="relative text-2xl font-bold italic leading-tight">
            Nobody ever regretted the workout they finished.
          </p>
          <p className="relative mt-3 text-[11px] font-bold uppercase tracking-[0.16em] opacity-70">
            Areviax · Daily
          </p>
        </Section>

        {/* recovery + sleep */}
        <Section delay={240} className="grid grid-cols-2 gap-3">
          <div className="rounded-3xl border border-border p-4">
            <Moon className="size-4 text-fuel" />
            <p className="label-eyebrow mt-2 text-fuel">Sleep</p>
            <p className="stat-huge mt-2">
              7.2<span className="font-mono text-xs text-muted-foreground">h</span>
            </p>
            <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
              48 min under your growth target.
            </p>
          </div>
          <div className="rounded-3xl border border-border p-4">
            <Dumbbell className="size-4 text-primary" />
            <p className="label-eyebrow mt-2 text-primary">Legs</p>
            <p className="stat-huge mt-2">
              36<span className="font-mono text-xs text-muted-foreground">h</span>
            </p>
            <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
              Still fusing protein. Train upper today.
            </p>
          </div>
        </Section>
      </main>

      {/* START bar + nav */}
      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md">
        <div className="bg-gradient-to-t from-background via-background to-transparent px-5 pb-2 pt-6">
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
                    aria-label={label}
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
