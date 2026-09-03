import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Flame,
  Star,
  Droplet,
  Coffee,
  Camera,
  BookOpen,
  Plus,
  Check,
  Target,
  Clock,
  Sparkles,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { GreekMark, Meander, SectionTitle } from "@/components/GreekMark";

export const Route = createFileRoute("/nutrition")({
  head: () => ({
    meta: [
      { title: "Areviax — Nutrition & Fuel Tracking" },
      {
        name: "description",
        content:
          "Track calories, protein, carbs, fat and water in one calm view. Quick-add staples, smart logging and a 14-day fuel trend.",
      },
      { property: "og:title", content: "Areviax — Nutrition & Fuel Tracking" },
      {
        property: "og:description",
        content:
          "Track calories, protein, carbs, fat and water in one calm view. Quick-add staples, smart logging and a 14-day fuel trend.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NutritionScreen,
});

/* ---------- data ---------- */

const TARGETS = { kcal: 3345, protein: 141, carbs: 486, fat: 93 };

const QUICK_ADD = [
  { name: "Protein shake", kcal: 113, p: 13, c: 4, f: 2 },
  { name: "Peanut butter · 2 tbsp", kcal: 190, p: 8, c: 6, f: 16 },
  { name: "Whole milk · 500ml", kcal: 310, p: 16, c: 24, f: 17 },
  { name: "Nuts · handful", kcal: 170, p: 5, c: 6, f: 15 },
  { name: "Banana + PB", kcal: 280, p: 9, c: 34, f: 12 },
  { name: "Greek yogurt · 200g", kcal: 160, p: 20, c: 9, f: 5 },
  { name: "Chicken · 150g", kcal: 245, p: 46, c: 0, f: 6 },
  { name: "Rice · 200g cooked", kcal: 260, p: 5, c: 57, f: 1 },
];

const TREND = [0.72, 0.9, 1.02, 0.66, 0.94, 1.05, 0.88, 0.41, 0.97, 1.0, 0.79, 0.93, 1.08, 0.55];

/* ---------- primitives ---------- */

function MacroRow({
  label,
  value,
  target,
  unit = "g",
  tone,
}: {
  label: string;
  value: number;
  target: number;
  unit?: string;
  tone: "primary" | "fuel" | "xp";
}) {
  const pct = Math.min((value / target) * 100, 100);
  const bar =
    tone === "fuel" ? "bg-fuel" : tone === "xp" ? "bg-xp" : "bg-primary";
  const txt =
    tone === "fuel" ? "text-fuel" : tone === "xp" ? "text-xp" : "text-primary";
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className={`label-eyebrow ${txt}`}>{label}</span>
        <span className="font-mono text-xs tabular-nums">
          {Math.round(value).toLocaleString()}
          {unit}
          <span className="text-muted-foreground">
            {" / "}
            {target.toLocaleString()}
            {unit}
          </span>
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${bar} transition-[width] duration-700`}
          style={{ width: `${pct}%` }}
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

/* ---------- screen ---------- */

function NutritionScreen() {
  const [logged, setLogged] = useState<typeof QUICK_ADD>([]);
  const [water, setWater] = useState(0);
  const [questDone, setQuestDone] = useState(false);

  const totals = logged.reduce(
    (a, f) => ({
      kcal: a.kcal + f.kcal,
      p: a.p + f.p,
      c: a.c + f.c,
      f: a.f + f.f,
    }),
    { kcal: 0, p: 0, c: 0, f: 0 },
  );

  const kcalPct = Math.min((totals.kcal / TARGETS.kcal) * 100, 100);
  const remaining = Math.max(TARGETS.kcal - totals.kcal, 0);

  return (
    <div className="marble mx-auto flex min-h-screen w-full max-w-md flex-col">
      {/* HERO */}
      <header className="ember-wash grain colonnade temple-glow pediment laurel-watermark relative overflow-hidden px-5 pb-8 pt-6">
        <span className="ghost-numeral absolute -right-3 top-16 font-serif">Δ</span>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <GreekMark className="size-6 text-gold" />
              <span className="wordmark">Areviax</span>
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

          <p className="label-eyebrow pulse-dot mt-6 flex items-center text-foreground/70">
            Fuel · Day 1 of week 3
          </p>
          <h1 className="display-hero mt-2">
            Eat
            <br />
            <span className="serif-accent gold-text text-[0.8em]">to grow</span>
          </h1>

          {/* headline number */}
          <div className="mt-5 flex items-end justify-between">
            <div>
              <p className="label-eyebrow">Remaining today</p>
              <p className="stat-huge mt-2">
                {remaining.toLocaleString()}
                <span className="ml-1 font-mono text-xs text-muted-foreground">
                  kcal
                </span>
              </p>
            </div>
            <p className="font-mono text-[11px] text-muted-foreground">
              {Math.round(kcalPct)}% of {TARGETS.kcal.toLocaleString()}
            </p>
          </div>
          <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-700"
              style={{ width: `${kcalPct}%` }}
            />
          </div>

          <Meander bold className="mt-6" />
        </div>
      </header>

      <main className="flex-1 space-y-3 px-5 pb-36">
        {/* actions */}
        <Section delay={40} className="grid grid-cols-3 gap-2">
          <button className="ember grain flex flex-col items-start gap-2 rounded-2xl p-3 text-left transition-transform active:scale-[0.98]">
            <Coffee className="size-4" />
            <span className="text-[11px] font-bold uppercase leading-tight tracking-wider">
              Log meal
            </span>
          </button>
          <button className="flex flex-col items-start gap-2 rounded-2xl border border-fuel/40 p-3 text-left text-fuel">
            <Camera className="size-4" />
            <span className="text-[11px] font-bold uppercase leading-tight tracking-wider">
              Vision scan
            </span>
            <span className="font-mono text-[9px] text-muted-foreground">soon</span>
          </button>
          <button className="flex flex-col items-start gap-2 rounded-2xl border border-border-strong p-3 text-left">
            <BookOpen className="size-4 text-gold" />
            <span className="text-[11px] font-bold uppercase leading-tight tracking-wider">
              Recipes
            </span>
          </button>
        </Section>

        {/* macros */}
        <Section delay={80} className="surface rounded-3xl p-5">
          <SectionTitle
            numeral="Α"
            right={
              <span className="font-mono text-[11px] text-muted-foreground">
                {logged.length} items
              </span>
            }
          >
            Today
          </SectionTitle>
          <div className="mt-5 space-y-4">
            <MacroRow
              label="Calories"
              value={totals.kcal}
              target={TARGETS.kcal}
              unit=""
              tone="primary"
            />
            <MacroRow
              label="Protein"
              value={totals.p}
              target={TARGETS.protein}
              tone="fuel"
            />
            <MacroRow
              label="Carbs"
              value={totals.c}
              target={TARGETS.carbs}
              tone="primary"
            />
            <MacroRow label="Fat" value={totals.f} target={TARGETS.fat} tone="xp" />
          </div>
        </Section>

        {/* water */}
        <Section delay={120} className="surface rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="section-title flex items-baseline gap-2">
              <span className="greek-numeral">Β</span> Water
            </h2>
            <span className="font-mono text-[11px] text-fuel tabular-nums">
              {water} / 8
            </span>
          </div>
          <div className="rule-gold mt-2" />
          <div className="mt-4 flex gap-1.5">
            {Array.from({ length: 8 }).map((_, i) => {
              const filled = i < water;
              return (
                <button
                  key={i}
                  aria-label={`Glass ${i + 1}`}
                  onClick={() => setWater(filled && i === water - 1 ? i : i + 1)}
                  className={[
                    "flex h-11 flex-1 items-center justify-center rounded-lg border transition-colors",
                    filled
                      ? "border-fuel bg-fuel/15 text-fuel"
                      : "border-border text-muted-foreground",
                  ].join(" ")}
                >
                  <Droplet className={filled ? "size-4 fill-current" : "size-4"} />
                </button>
              );
            })}
          </div>
        </Section>

        {/* quick add */}
        <Section delay={160} className="surface rounded-3xl p-5">
          <SectionTitle
            numeral="Γ"
            right={
              <span className="font-mono text-[11px] text-muted-foreground">
                one tap
              </span>
            }
          >
            Quick add
          </SectionTitle>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {QUICK_ADD.map((f) => {
              const count = logged.filter((l) => l.name === f.name).length;
              return (
                <button
                  key={f.name}
                  onClick={() => setLogged((p) => [...p, f])}
                  className={[
                    "flex flex-col items-start gap-1 rounded-2xl border p-3 text-left transition-colors",
                    count
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-border-strong",
                  ].join(" ")}
                >
                  <span className="flex w-full items-start justify-between gap-1 text-xs font-semibold leading-tight">
                    {f.name}
                    {count ? (
                      <span className="font-mono text-[10px] text-primary">
                        ×{count}
                      </span>
                    ) : (
                      <Plus className="size-3.5 shrink-0 text-muted-foreground" />
                    )}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {f.kcal} kcal · {f.p}g P
                  </span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* quest */}
        <Section delay={200} className="surface rounded-3xl p-5">
          <SectionTitle numeral="Δ">Daily rite</SectionTitle>
          <p className="mt-4 text-sm leading-snug">
            Have a protein shake between two meals today.
          </p>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">
            ~200–250 kcal · mid-morning or mid-afternoon
          </p>
          <button
            onClick={() => setQuestDone(true)}
            disabled={questDone}
            className={[
              "mt-4 flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors",
              questDone
                ? "border border-border-strong text-muted-foreground"
                : "ember",
            ].join(" ")}
          >
            {questDone ? (
              <>
                <Check className="size-3.5" /> Claimed · +15 XP
              </>
            ) : (
              <>
                <Target className="size-3.5" /> Mark done · +15 XP
              </>
            )}
          </button>
        </Section>

        {/* trend */}
        <Section delay={240} className="surface rounded-3xl p-5">
          <SectionTitle
            numeral="Ε"
            right={
              <span className="font-mono text-[11px] text-primary">9 / 14 hit</span>
            }
          >
            14-day fuel
          </SectionTitle>
          <div className="mt-5 flex h-24 items-end gap-1">
            {TREND.map((v, i) => {
              const hit = v >= 0.9;
              return (
                <div
                  key={i}
                  className={
                    hit
                      ? "flex-1 rounded-t-sm bg-primary"
                      : "flex-1 rounded-t-sm bg-border-strong"
                  }
                  style={{ height: `${Math.min(v, 1.15) * 84}px` }}
                />
              );
            })}
          </div>
          <p className="mt-3 font-mono text-[10px] text-muted-foreground">
            Bar height = share of calorie target · ember = target hit
          </p>
        </Section>

        {/* logged today */}
        <Section delay={280} className="surface rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="section-title flex items-baseline gap-2">
              <span className="greek-numeral">Ζ</span> Logged
            </h2>
            {logged.length ? (
              <button
                onClick={() => setLogged([])}
                className="text-[11px] font-bold uppercase tracking-wider text-primary"
              >
                Reset
              </button>
            ) : null}
          </div>
          <div className="rule-gold mt-2" />
          {logged.length === 0 ? (
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4" /> Nothing logged yet — start with a quick
              add above.
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-border">
              {logged.map((f, i) => (
                <li key={`${f.name}-${i}`} className="flex items-center gap-3 py-3">
                  <span className="w-5 font-mono text-[11px] text-muted-foreground tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                    {f.name}
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {f.kcal} kcal
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        {/* meal plan */}
        <Section delay={320} className="ember relative overflow-hidden rounded-3xl p-6">
          <Sparkles className="size-5" />
          <p className="serif-accent mt-3 text-[1.7rem] leading-[1.15]">
            Build a plan that hits your numbers.
          </p>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.16em] opacity-70">
            Generate 1–30 days · or build your own
          </p>
          <div className="mt-4 flex gap-2">
            <button className="rounded-full bg-background/20 px-4 py-2 text-[11px] font-bold uppercase tracking-wider">
              Generate plan
            </button>
            <button className="rounded-full border border-current/40 px-4 py-2 text-[11px] font-bold uppercase tracking-wider">
              Build my own
            </button>
          </div>
        </Section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md">
        <BottomNav active="Fuel" />
      </div>
    </div>
  );
}
