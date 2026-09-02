import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Flame,
  Star,
  Trophy,
  Lock,
  Dumbbell,
  Moon,
  Coffee,
  Sunrise,
  Mountain,
  Zap,
  Medal,
  type LucideIcon,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { GreekMark, Meander } from "@/components/GreekMark";

export const Route = createFileRoute("/trophies")({
  head: () => ({
    meta: [
      { title: "Trophy Room — Areviax Achievements" },
      {
        name: "description",
        content:
          "Every badge you've earned, what's next, and exactly how far you are from the next unlock.",
      },
      { property: "og:title", content: "Trophy Room — Areviax Achievements" },
      {
        property: "og:description",
        content:
          "Every badge you've earned, what's next, and exactly how far you are from the next unlock.",
      },
    ],
  }),
  component: TrophyScreen,
});

/* ---------- data ---------- */

type Badge = {
  name: string;
  icon: LucideIcon;
  tier: "bronze" | "silver" | "gold";
  detail: string;
  progress: number;
  goal: number;
  unit?: string;
  earnedOn?: string;
  tone: "primary" | "fuel" | "xp";
};

const TABS = ["All", "Strength", "Habit", "Volume"] as const;

const BADGES: (Badge & { cat: (typeof TABS)[number] })[] = [
  {
    name: "First Blood",
    icon: Dumbbell,
    tier: "bronze",
    detail: "Log your first session",
    progress: 1,
    goal: 1,
    earnedOn: "12 Jun",
    tone: "primary",
    cat: "Strength",
  },
  {
    name: "Century Club",
    icon: Mountain,
    tier: "silver",
    detail: "100 tonnes lifted lifetime",
    progress: 100,
    goal: 100,
    unit: "t",
    earnedOn: "3 Aug",
    tone: "primary",
    cat: "Volume",
  },
  {
    name: "Protein Purist",
    icon: Coffee,
    tier: "bronze",
    detail: "Hit protein 7 days straight",
    progress: 7,
    goal: 7,
    earnedOn: "21 Jul",
    tone: "fuel",
    cat: "Habit",
  },
  {
    name: "Early Iron",
    icon: Sunrise,
    tier: "bronze",
    detail: "10 sessions before 7am",
    progress: 10,
    goal: 10,
    earnedOn: "9 Aug",
    tone: "xp",
    cat: "Habit",
  },
  {
    name: "Triple Plate",
    icon: Zap,
    tier: "gold",
    detail: "Deadlift 180 kg",
    progress: 165,
    goal: 180,
    unit: "kg",
    tone: "primary",
    cat: "Strength",
  },
  {
    name: "Unbroken",
    icon: Flame,
    tier: "silver",
    detail: "14-day training streak",
    progress: 2,
    goal: 14,
    unit: "d",
    tone: "primary",
    cat: "Habit",
  },
  {
    name: "Deep Sleeper",
    icon: Moon,
    tier: "silver",
    detail: "7h+ sleep, 30 nights",
    progress: 19,
    goal: 30,
    unit: "n",
    tone: "fuel",
    cat: "Habit",
  },
  {
    name: "Half Kiloton",
    icon: Medal,
    tier: "gold",
    detail: "500 tonnes lifted lifetime",
    progress: 312,
    goal: 500,
    unit: "t",
    tone: "xp",
    cat: "Volume",
  },
];

const TIER_RING: Record<Badge["tier"], string> = {
  bronze: "border-border-strong",
  silver: "border-fuel/50",
  gold: "border-xp/60",
};

/* ---------- primitives ---------- */

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

function BadgeTile({ b }: { b: Badge }) {
  const earned = b.progress >= b.goal;
  const pct = Math.min((b.progress / b.goal) * 100, 100);
  const Icon = b.icon;
  const txt =
    b.tone === "fuel" ? "text-fuel" : b.tone === "xp" ? "text-xp" : "text-primary";
  const bar = b.tone === "fuel" ? "bg-fuel" : b.tone === "xp" ? "bg-xp" : "bg-primary";

  return (
    <div
      className={[
        "flex flex-col rounded-3xl border p-4",
        earned ? "surface" : "border-border bg-card/30",
      ].join(" ")}
    >
      <div
        className={[
          "flex size-11 items-center justify-center rounded-2xl border-2",
          earned ? TIER_RING[b.tier] : "border-border",
        ].join(" ")}
      >
        {earned ? (
          <Icon className={`size-5 ${txt}`} />
        ) : (
          <Lock className="size-4 text-muted-foreground" />
        )}
      </div>

      <p
        className={[
          "mt-3 text-sm font-bold uppercase tracking-wider",
          earned ? "" : "text-muted-foreground",
        ].join(" ")}
      >
        {b.name}
      </p>
      <p className="mt-1 flex-1 text-[11px] leading-snug text-muted-foreground">
        {b.detail}
      </p>

      {earned ? (
        <p className={`mt-3 font-mono text-[10px] uppercase tracking-wider ${txt}`}>
          {b.tier} · {b.earnedOn}
        </p>
      ) : (
        <>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full ${bar} transition-[width] duration-700`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1.5 font-mono text-[10px] text-muted-foreground tabular-nums">
            {b.progress}/{b.goal}
            {b.unit} · {b.goal - b.progress}
            {b.unit} to go
          </p>
        </>
      )}
    </div>
  );
}

/* ---------- screen ---------- */

function TrophyScreen() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const list = tab === "All" ? BADGES : BADGES.filter((b) => b.cat === tab);
  const earned = BADGES.filter((b) => b.progress >= b.goal).length;
  const next = [...BADGES]
    .filter((b) => b.progress < b.goal)
    .sort((a, b) => b.progress / b.goal - a.progress / a.goal)[0];

  return (
    <div className="mx-auto marble flex min-h-screen w-full max-w-md flex-col">
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/85 px-5 py-2.5 backdrop-blur-xl">
        <Link
          to="/progress"
          className="label-eyebrow flex items-center gap-1.5 text-foreground"
        >
          <ArrowLeft className="size-3.5" /> <GreekMark className="size-5 text-gold" /> <span className="wordmark text-[11px]">Trophies</span>
        </Link>
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
            <Flame className="size-3" /> 2
          </span>
          <span className="flex items-center gap-1 rounded-full border border-border-strong px-2 py-0.5 text-[10px] font-bold text-xp">
            <Star className="size-3" /> 415
          </span>
        </div>
      </div>

      {/* HERO */}
      <header className="ember-wash grain colonnade temple-glow pediment laurel-watermark relative overflow-hidden px-5 pb-7 pt-6">
        <span className="ghost-numeral absolute -right-4 top-10 font-serif">Θ</span>
        <div className="relative z-10">
          <p className="label-eyebrow text-gold">Trophy room</p>
          <h1 className="display-hero mt-2">
            {earned}
            <span className="serif-accent gold-text text-[0.6em]">/{BADGES.length}</span>
          </h1>
          <div className="mt-3 flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1 text-xp">
              <Trophy className="size-3.5" /> 3 gold locked
            </span>
            <span>· 415 XP banked</span>
          </div>
          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(earned / BADGES.length) * 100}%` }}
            />
          </div>
        </div>
        <Meander bold className="mt-5" />
      </header>

      <main className="flex-1 space-y-3 px-5 pb-28">
        {/* next unlock — one clear target */}
        {next ? (
          <Section delay={40} className="surface rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <span className="label-eyebrow text-primary">Closest unlock</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {Math.round((next.progress / next.goal) * 100)}%
              </span>
            </div>
            <h2 className="section-title mt-2 text-4xl">{next.name}</h2>
            <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
              {next.detail} — {next.goal - next.progress}
              {next.unit} left.
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-700"
                style={{ width: `${(next.progress / next.goal) * 100}%` }}
              />
            </div>
          </Section>
        ) : null}

        {/* filter */}
        <Section delay={80} className="scroll-row -mx-1 px-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                "rounded-full border px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors",
                t === tab
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border-strong text-muted-foreground",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </Section>

        {/* grid */}
        <Section delay={120} className="grid grid-cols-2 gap-3">
          {list.map((b) => (
            <BadgeTile key={b.name} b={b} />
          ))}
        </Section>

        {/* recent activity */}
        <Section delay={160} className="surface rounded-3xl p-5">
          <h2 className="section-title flex items-baseline gap-2"><span className="greek-numeral">Ε</span>Latest</h2>
          <ul className="mt-4 divide-y divide-border">
            {BADGES.filter((b) => b.earnedOn)
              .slice(0, 3)
              .map((b) => (
                <li key={b.name} className="flex items-center gap-3 py-3">
                  <b.icon className="size-4 shrink-0 text-xp" />
                  <p className="min-w-0 flex-1 truncate text-sm font-semibold">
                    {b.name}
                  </p>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {b.earnedOn}
                  </span>
                </li>
              ))}
          </ul>
        </Section>
      </main>

      <div className="sticky bottom-0 z-20">
        <BottomNav active="Trophies" />
      </div>
    </div>
  );
}
