import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("theme");
  return stored === "dark" ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const t = getInitialTheme();
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);

  const update = (next: Theme) => {
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      window.localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <div className="inline-flex items-center rounded-full border-2 border-foreground bg-surface p-1">
      <button
        type="button"
        aria-label="Light mode"
        aria-pressed={theme === "light"}
        onClick={() => update("light")}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-display font-bold transition-colors ${
          theme === "light"
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Sun className="size-3.5" />
        Light
      </button>
      <button
        type="button"
        aria-label="Dark mode"
        aria-pressed={theme === "dark"}
        onClick={() => update("dark")}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-display font-bold transition-colors ${
          theme === "dark"
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Moon className="size-3.5" />
        Dark
      </button>
    </div>
  );
}
