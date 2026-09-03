import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Flame,
  Star,
  Zap,
  Play,
  Dice5,
  Repeat,
  Save,
  ChevronRight,
  Check,
  Search,
  Dumbbell,
  Activity,
  Timer,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { GreekMark, Meander, SectionTitle } from "@/components/GreekMark";

export const Route = createFileRoute("/workout")({
  head: () => ({
    meta: [
      { title: "Areviax — Build Today's Session" },
      {
        name: "description",
        content:
          "Design your training session: readiness by muscle, focus, equipment and a clean exercise list. Auto-build or craft it yourself.",
      },
      { property: "og:title", content: "Areviax — Build Today's Session" },
      {
        property: "og:description",
        content:
          "Design your training session: readiness by muscle, focus, equipment and a clean exercise list.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkoutScreen,
});

/* ---------- data ---------- */

type Readiness = "ready" | "recovering" | "fatigued";

const MUSCLES: { group: string; items: { name: string; state: Readiness }[] }[] = [
  {
    group: "Upper body",
    items: [
      { name: "Chest", state: "ready" },
      { name: "Back", state: "recovering" },
      { name: "Shoulders", state: "ready" },
      { name: "Biceps", state: "ready" },
      { name: "Triceps", state: "ready" },
    ],
  },
  {
    group: "Lower body",
    items: [
      { name: "Quads", state: "recovering" },
      { name: "Hamstrings", state: "ready" },
      { name: "Glutes", state: "ready" },
      { name: "Calves", state: "fatigued" },
      { name: "Core", state: "ready" },
    ],
  },
];

const FOCUS = ["Strength", "Size", "Pump"] as const;
const PLACES = [
  "Full gym",
  "Dumbbells + bench",
  "Dumbbells only",
  "Home / minimal",
  "Bodyweight",
  "Park",
] as const;
const TYPES = ["Push upper", "Pull upper", "Lower", "Full body", "Cardio"] as const;
const TIMES = ["15–20 min", "30 min", "45 min", "60 min+"] as const;

const EXERCISES = [
  { name: "Barbell bench press", target: "Chest · triceps", sets: "3 × 6–8" },
  { name: "Incline dumbbell press", target: "Upper chest", sets: "3 × 8–10" },
  { name: "Seated shoulder press", target: "Shoulders", sets: "3 × 8–10" },
  { name: "Cable lateral raise", target: "Side delts", sets: "3 × 12–15" },
  { name: "Rope triceps extension", target: "Triceps", sets: "3 × 12" },
  { name: "Dips", target: "Chest · triceps", sets: "2 × AMRAP" },
];

const HISTORY = [
  { name: "Upper and lower", meta: "Tue 1 Sep · 5 lifts · 48 min" },
  { name: "Upper body", meta: "Sun 30 Aug · 11 lifts · 52 min" },
  { name: "Push upper", meta: "Sat 29 Aug · 5 lifts · 41 min" },
  { name: "Push upper", meta: "Sun 23 Aug · 3 lifts · 26 min" },
];

const READY_TONE: Record<Readiness, { dot: string; text: string; label: string }> = {
  ready: { dot: "bg-fuel", text: "text-fuel", label: "Ready" },
  recovering: { dot: "bg-xp", text: "text-xp", label: "Recovering" },
  fatigued: { dot: "bg-primary", text: "text-primary", label: "Fatigued" },
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

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "border-gold bg-gold/10 text-gold"
          : "border-border text-muted-foreground hover:border-border-strong",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/* ---------- screen ---------- */

function WorkoutScreen() {
  const [type, setType] = useState<string>(TYPES[0]);
  const [time, setTime] = useState<string>(TIMES[0]);
  const [focus, setFocus] = useState<string>("Size");
  const [place, setPlace] = useState<string>(PLACES[0]);
  const [picked, setPicked] = useState<string[]>(["Chest", "Shoulders", "Triceps"]);
  const [query, setQuery] = useState("");

  const toggle = (m: string) =>
    setPicked((p) => (p.includes(m) ? p.filter((x) => x !== m) : [...p, m]));

  const list = EXERCISES.filter(
    (e) =>
      !query ||
      e.name.toLowerCase().includes(query.toLowerCase()) ||
      e.target.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="marble mx-auto flex min-h-screen w-full max-w-md flex-col">
      {/* HERO */}
      <header className="ember-wash grain colonnade temple-glow pediment laurel-watermark relative overflow-hidden px-5 pb-8 pt-6">
        <span className="ghost-numeral absolute -right-3 top-16 font-serif">Ω</span>
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
            The Palaestra · Day 1 of week 3
          </p>
          <h1 className="display-hero mt-2">
            Forge
            <br />
            <span className="serif-accent gold-text text-[0.8em]">the session</span>
          </h1>

          <div className="mt-5 flex items-end justify-between">
            <div>
              <p className="label-eyebrow">Today</p>
              <p className="stat-huge mt-2">
                {list.length}
                <span className="ml-1 font-mono text-xs text-muted-foreground">
                  lifts
                </span>
              </p>
            </div>
            <p className="max-w-[52%] text-right font-mono text-[11px] leading-relaxed text-muted-foreground">
              {type} · {time} · {focus.toLowerCase()}
            </p>
          </div>

          <Meander bold className="mt-6" />
        </div>
      </header>

      <main className="flex-1 space-y-3 px-5 pb-40">
        {/* advisory */}
        <Section delay={40} className="surface rounded-3xl p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-xp" />
            <p className="text-sm leading-snug">
              Today's plan is{" "}
              <span className="serif-accent gold-text text-[1.15em]">Push upper</span>,
              but <span className="font-semibold text-xp">Back</span> isn't fully
              recovered. Push through, or re-target the muscles below.
            </p>
          </div>
          <div className="rule-gold mt-4" />
          <div className="mt-4 flex items-center gap-2">
            <button className="ember flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-transform active:scale-[0.98]">
              <Play className="size-3.5" /> Start anyway
            </button>
            <button className="flex items-center gap-2 rounded-full border border-border-strong px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <Zap className="size-3.5 text-fuel" /> 3-min rescue
            </button>
          </div>
        </Section>

        {/* session frame */}
        <Section delay={80} className="surface fluted rounded-3xl p-5">
          <SectionTitle numeral="Α">Session</SectionTitle>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="label-eyebrow flex items-center gap-1.5">
                <Dumbbell className="size-3" /> Type
              </span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border-strong bg-transparent px-3 py-2.5 text-sm font-semibold outline-none focus:border-gold"
              >
                {TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="label-eyebrow flex items-center gap-1.5">
                <Timer className="size-3" /> Time
              </span>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border-strong bg-transparent px-3 py-2.5 text-sm font-semibold outline-none focus:border-gold"
              >
                {TIMES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5">
            <span className="label-eyebrow flex items-center gap-1.5">
              <Activity className="size-3" /> Focus
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {FOCUS.map((f) => (
                <Pill key={f} active={focus === f} onClick={() => setFocus(f)}>
                  {f}
                </Pill>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <span className="label-eyebrow flex items-center gap-1.5">
              <MapPin className="size-3" /> Training at
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {PLACES.map((p) => (
                <Pill key={p} active={place === p} onClick={() => setPlace(p)}>
                  {p}
                </Pill>
              ))}
            </div>
          </div>
        </Section>

        {/* readiness */}
        <Section delay={120} className="surface rounded-3xl p-5">
          <SectionTitle
            numeral="Β"
            right={
              <span className="font-mono text-[11px] text-muted-foreground">
                {picked.length} picked
              </span>
            }
          >
            Readiness
          </SectionTitle>
          <div className="mt-3 flex items-center gap-4">
            {(["ready", "recovering", "fatigued"] as Readiness[]).map((s) => (
              <span
                key={s}
                className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
              >
                <span className={`size-1.5 rounded-full ${READY_TONE[s].dot}`} />
                {READY_TONE[s].label}
              </span>
            ))}
          </div>

          {MUSCLES.map((g) => (
            <div key={g.group} className="mt-5">
              <p className="label-eyebrow text-muted-foreground">{g.group}</p>
              <div className="mt-2 divide-y divide-border rounded-2xl border border-border">
                {g.items.map((m) => {
                  const on = picked.includes(m.name);
                  return (
                    <button
                      key={m.name}
                      onClick={() => toggle(m.name)}
                      className={[
                        "flex w-full items-center justify-between px-4 py-3 text-left transition-colors",
                        on ? "bg-gold/[0.07]" : "",
                      ].join(" ")}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className={`size-1.5 rounded-full ${READY_TONE[m.state].dot}`}
                        />
                        <span className="text-sm font-semibold">{m.name}</span>
                      </span>
                      <span
                        className={[
                          "flex size-5 items-center justify-center rounded-full border",
                          on
                            ? "border-gold bg-gold text-background"
                            : "border-border-strong",
                        ].join(" ")}
                      >
                        {on ? <Check className="size-3" /> : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </Section>

        {/* exercises */}
        <Section delay={160} className="surface rounded-3xl p-5">
          <SectionTitle
            numeral="Γ"
            right={
              <button className="flex items-center gap-1.5 font-mono text-[11px] text-gold">
                <Dice5 className="size-3.5" /> reroll
              </button>
            }
          >
            Exercises
          </SectionTitle>

          <label className="mt-4 flex items-center gap-2 rounded-xl border border-border px-3 py-2.5">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or muscle"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>

          <ol className="mt-4 space-y-2">
            {list.map((e, i) => (
              <li
                key={e.name}
                className="flex items-center gap-3 rounded-2xl border border-border p-3.5"
              >
                <span className="greek-numeral w-5 shrink-0 text-center">
                  {["Α", "Β", "Γ", "Δ", "Ε", "Ζ", "Η", "Θ"][i] ?? i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{e.name}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {e.target} · {e.sets}
                  </span>
                </span>
                <button
                  aria-label={`Swap ${e.name}`}
                  className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border-strong text-muted-foreground"
                >
                  <Repeat className="size-3.5" />
                </button>
              </li>
            ))}
            {!list.length ? (
              <li className="py-6 text-center font-mono text-[11px] text-muted-foreground">
                No lifts match "{query}"
              </li>
            ) : null}
          </ol>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-2 rounded-full border border-border-strong px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider">
              <Save className="size-3.5 text-gold" /> Save
            </button>
            <button className="flex items-center justify-center gap-2 rounded-full border border-gold/50 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gold">
              <Zap className="size-3.5" /> Auto build
            </button>
          </div>
        </Section>

        {/* history */}
        <Section delay={200} className="surface rounded-3xl p-5">
          <SectionTitle numeral="Δ">Past labours</SectionTitle>
          <ul className="mt-4 divide-y divide-border">
            {HISTORY.map((h, i) => (
              <li key={i}>
                <button className="flex w-full items-center justify-between py-3 text-left">
                  <span>
                    <span className="block text-sm font-semibold">{h.name}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {h.meta}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-gold">
                    Load <ChevronRight className="size-3.5" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Section>

        <p className="serif-accent px-2 pt-4 text-center text-lg leading-snug text-muted-foreground">
          “No man has the right to be an amateur in the matter of physical training.”
          <span className="mt-1 block font-mono text-[10px] uppercase tracking-widest text-gold/70">
            Socrates
          </span>
        </p>
      </main>

      {/* fixed CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-md">
        <div className="px-5 pb-2">
          <button className="ember grain flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold uppercase tracking-wider transition-transform active:scale-[0.99]">
            <Play className="size-4" /> Start session
          </button>
        </div>
        <BottomNav active="Build" />
      </div>
    </div>
  );
}
