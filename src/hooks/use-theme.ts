import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

function read(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(read());
    const obs = new MutationObserver(() => setTheme(read()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return theme;
}
