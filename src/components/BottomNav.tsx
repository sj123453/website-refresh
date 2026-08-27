import { Link } from "@tanstack/react-router";
import {
  Home,
  Dumbbell,
  Coffee,
  BarChart3,
  Trophy,
  type LucideIcon,
} from "lucide-react";

const NAV: { icon: LucideIcon; label: string; to: string }[] = [
  { icon: Home, label: "Home", to: "/" },
  { icon: Dumbbell, label: "Build", to: "/" },
  { icon: Coffee, label: "Fuel", to: "/" },
  { icon: BarChart3, label: "Progress", to: "/progress" },
  { icon: Trophy, label: "Trophies", to: "/trophies" },
];

export function BottomNav({ active }: { active: string }) {
  return (
    <nav className="border-t border-border bg-background/90 px-3 pb-5 pt-2 backdrop-blur-xl">
      <ul className="flex items-end justify-between">
        {NAV.map(({ icon: Icon, label, to }) => {
          const isActive = active === label;
          return (
            <li key={label} className="flex-1">
              <Link
                to={to}
                aria-label={label}
                className="flex w-full flex-col items-center gap-1.5 py-1"
              >
                <Icon
                  className={
                    isActive ? "size-5 text-primary" : "size-5 text-muted-foreground"
                  }
                />
                <span
                  className={
                    isActive
                      ? "h-1 w-1 rounded-full bg-primary"
                      : "h-1 w-1 rounded-full bg-transparent"
                  }
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
