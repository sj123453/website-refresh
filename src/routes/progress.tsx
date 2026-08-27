import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Flame,
  Star,
  TrendingUp,
  Trophy,
  ArrowUpRight,
  Dumbbell,
  Moon,
  Coffee,
  Target,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress — Areviax Training Analytics" },
      {
        name: "description",
        content:
          "Volume trend, personal records, bodyweight and consistency for the last 12 weeks of training.",
      },
      { property: "og:title", content: "Progress — Areviax Training Analytics" },
      {
        property: "og:description",
        content:
          "Volume trend, personal records, bodyweight and consistency for the last 12 weeks of training.",
      },
    ],
  }),
  component: ProgressScreen,
});

/* ---------- data ---------- */

const RANGES = ["4W", "12W", "1Y"] as const;

const VOLUME: Record<(typeof RANGES)[number], number[]> = {
  "4W": [9.4, 11.2, 10.8, 12.4],
  "12W": [6.1, 7.2, 6.8, 8.4, 9.1, 8.6, 10.2, 9.4, 11.2, 10.8, 13.6, 12.4],
  "1Y": [3.2, 4.1, 5.4, 6.2, 7.8, 6.9, 8.8, 9.6, 10.4, 11.8, 12.9, 12.4],
};

const PRS = [
  { lift: "Incline Bench", load: "72.5 kg", delta: "+2.5", days: 0 },
  { lift: "Back Squat", load: "132.5 kg", delta: "+5.0", days: 6 },
  { lift: "Deadlift", load: "165 kg", delta: "+2.5", days: 11 },
  { lift: "Weighted Dip", load: "+20 kg", delta: "+2.5", days: 19 },
];

const BODYWEIGHT = [78.4, 78.1, 78.6, 78.2, 77.9, 77.6, 77.8, 77.4];

const SPLIT = [
  { group: "Push", sets: 62, pct: 100 },
  { group: "Pull", sets: 54, pct: 87 },
  { group: "Legs", sets: 41, pct: 66 },
  { group: "Core", sets: 18, pct: 29 },
];

const WEEKS = [
  [1, 1, 0, 1, 1, 0, 0],
  [1, 0, 1, 1, 0, 1, 0],
  [1, 1, 0, 1, 1, 0, 0],
  [1, 0, 1, 2, 0, 0, 0],
];

const HABITS = [
  { icon: Dumbbell, label: "Training", done: 3, of: 4, tone: "primary" as const },
  { icon: Coffee, label: "Protein", done: 5, of: 7, tone: "fuel" as const },
  { icon: Moon, label: "Sleep 7h+", done: 4, of: 7, tone: "xp" as const },
];

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

function VolumeChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <div className="flex h-24 items-end gap-1">
      {data.map((v, i) => {
        const last = i === data.length - 1;
        return (
          <div key={i} className="group flex-1">
            <div
              className={
                last
                  ? "w-full rounded-t-sm bg-primary"
                  : "w-full rounded-t-sm bg-border-strong"
              }
              style={{ height: `${Math.max((v / max) * 96, 3)}px` }}
            />
          </div>
        );
      })}
    </div>
  );
}

function BodyweightLine({ data }: { data: number[] }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 34 - ((v - min) / span) * 28 - 3;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 34" preserveAspectRatio="none" className="h-16 w-full">
      <polyline
        points={pts}
        fill="none"
        stroke="var(--color-fuel)"
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------- screen ---------- */

function ProgressScreen() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("12W");
  const data = VOLUME[range];
  const total = data.reduce((a, b) => a + b, 0);
  const first = data[0] ?? 0;
  const last = data[data.length - 1] ?? 0;
  const change = first ? Math.round(((last - first) / first) * 100) : 0;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      {/* thin bar — no wasted viewport */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/85 px-5 py-2.5 backdrop-blur-xl">
        <span className="label-eyebrow text-foreground">Progress</span>
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
            <Flame className="size-3" /> 2
          </span>
          <span className="flex items-center gap-1 rounded-full border border-border-strong px-2 py-0.5 text-[10px] font-bold text-xp">
            <Star className="size-3" /> 415
          </span>
        </div>
      </div>

      {/* HERO — one number that matters */}
      <header className="ember-wash grain relative overflow-hidden px-5 pb-7 pt-6">
        <span className="ghost-numeral absolute -right-4 top-10">12</span>
        <div className="relative z-10">
          <p className="label-eyebrow text-primary">Total volume · {range}</p>
          <h1 className="display-hero mt-2">
            {total.toFixed(0)}
            <span className="text-outline">t</span>
          </h1>
          <div className="mt-3 flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
            <span
              className={
                change >= 0
                  ? "flex items-center gap-1 text-primary"
                  : "flex items-center gap-1 text-fuel"
              }
            >
              <TrendingUp className="size-3.5" />
              {change >= 0 ? "+" : ""}
              {change}% vs start
            </span>
            <span>· 38 sessions logged</span>
          </div>

          <div className="mt-5 flex gap-1.5">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={[
                  "flex-1 rounded-lg border py-2 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors",
                  r === range
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-border text-muted-foreground",
                ].join(" ")}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-3 px-5 pb-28">
        {/* volume chart */}
        <Section delay={40} className="surface rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl leading-none">Tonnage</h2>
            <span className="font-mono text-[11px] text-muted-foreground">
              tonnes / week
            </span>
          </div>
          <div className="mt-4">
            <VolumeChart data={data} />
          </div>
          <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>{range === "1Y" ? "Sep" : `-${data.length}w`}</span>
            <span>now</span>
          </div>
        </Section>

        {/* PRs — the real signal, up top */}
        <Section delay={80} className="surface rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl leading-none">Records</h2>
            <span className="font-mono text-[11px] text-primary">4 this month</span>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {PRS.map((p) => (
              <li key={p.lift} className="flex items-center gap-3 py-3">
                <Trophy className="size-4 shrink-0 text-xp" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.lift}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {p.days === 0 ? "today" : `${p.days}d ago`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-semibold tabular-nums">
                    {p.load}
                  </p>
                  <p className="font-mono text-[11px] text-primary">{p.delta} kg</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* bodyweight */}
        <Section delay={120} className="surface rounded-3xl p-5">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="label-eyebrow text-fuel">Bodyweight</span>
              <p className="stat-huge mt-2">
                77.4
                <span className="font-mono text-xs text-muted-foreground">kg</span>
              </p>
            </div>
            <span className="font-mono text-[11px] text-fuel">-1.0 kg / 8w</span>
          </div>
          <BodyweightLine data={BODYWEIGHT} />
          <p className="text-[11px] leading-snug text-muted-foreground">
            Slow cut holding. Strength is still climbing — keep protein above 140 g.
          </p>
        </Section>

        {/* consistency grid */}
        <Section delay={160} className="surface rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl leading-none">Consistency</h2>
            <span className="font-mono text-[11px] text-muted-foreground">
              4 weeks · 14/16
            </span>
          </div>
          <div className="mt-4 space-y-1.5">
            {WEEKS.map((week, wi) => (
              <div key={wi} className="flex gap-1.5">
                {week.map((d, di) => (
                  <div
                    key={di}
                    className={[
                      "h-7 flex-1 rounded-md border",
                      d === 2
                        ? "border-primary bg-primary"
                        : d === 1
                          ? "border-primary/40 bg-primary/25"
                          : "border-border bg-muted/40",
                    ].join(" ")}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>M T W T F S S</span>
            <span>today</span>
          </div>
        </Section>

        {/* muscle split */}
        <Section delay={200} className="surface rounded-3xl p-5">
          <h2 className="text-2xl leading-none">Balance</h2>
          <div className="mt-4 space-y-3.5">
            {SPLIT.map((s) => (
              <div key={s.group}>
                <div className="flex items-baseline justify-between">
                  <span className="label-eyebrow">{s.group}</span>
                  <span className="font-mono text-xs tabular-nums">
                    {s.sets}
                    <span className="text-muted-foreground"> sets</span>
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-700"
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 flex items-start gap-2 text-[11px] leading-snug text-muted-foreground">
            <Target className="mt-0.5 size-3.5 shrink-0 text-primary" />
            Legs are 34% behind push. Add one lower session next week to even it out.
          </p>
        </Section>

        {/* habits — framed as built, not missing */}
        <Section delay={240} className="hairline-grid grid grid-cols-3 bg-card/60">
          {HABITS.map(({ icon: Icon, label, done, of, tone }) => {
            const bar =
              tone === "fuel" ? "bg-fuel" : tone === "xp" ? "bg-xp" : "bg-primary";
            const txt =
              tone === "fuel" ? "text-fuel" : tone === "xp" ? "text-xp" : "text-primary";
            return (
              <div key={label} className="flex flex-col gap-3 p-4">
                <Icon className={`size-4 ${txt}`} />
                <span className="label-eyebrow">{label}</span>
                <div className="flex items-baseline gap-1">
                  <span className="stat-huge">{done}</span>
                  <span className={`font-mono text-[11px] ${txt}`}>/{of}</span>
                </div>
                <div className="h-[3px] overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${bar}`}
                    style={{ width: `${(done / of) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </Section>

        {/* trophies teaser -> separate page */}
        <Section delay={280}>
          <Link
            to="/trophies"
            className="ember grain flex items-center justify-between rounded-3xl px-5 py-4 transition-transform active:scale-[0.98]"
          >
            <span>
              <span className="block text-lg font-extrabold uppercase tracking-[0.16em]">
                Trophy room
              </span>
              <span className="font-mono text-[11px] opacity-80">
                9 of 24 unlocked · 1 close
              </span>
            </span>
            <ArrowUpRight className="size-5" />
          </Link>
        </Section>
      </main>

      <div className="sticky bottom-0 z-20">
        <BottomNav active="Progress" />
      </div>
    </div>
  );
}
