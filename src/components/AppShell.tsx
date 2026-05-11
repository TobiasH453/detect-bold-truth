import { Link } from "@tanstack/react-router";
import { Sparkles, History } from "lucide-react";
import type { ReactNode } from "react";
import { Logo, Wordmark } from "./Logo";

interface Props {
  children: ReactNode;
  showNav?: boolean;
}

export function AppShell({ children, showNav = true }: Props) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-[520px] flex-1 flex flex-col relative">
        <Header />
        <main className="flex-1 pb-28 px-5 pt-3">{children}</main>
        {showNav && <BottomNav />}
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Logo size={28} />
          <Wordmark className="text-lg" />
        </Link>
      </div>
    </header>
  );
}

function BottomNav() {
  const items = [
    { to: "/", icon: Sparkles, label: "Detect" },
    { to: "/history", icon: History, label: "History" },
  ] as const;
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[520px] bg-background border-t border-border z-30">
      <div className="flex items-stretch justify-around">
        {items.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="flex-1 flex flex-col items-center gap-1 py-3 text-muted-foreground transition-colors"
            activeProps={{ className: "text-foreground" }}
          >
            <Icon className="size-5" strokeWidth={2.25} />
            <span className="text-[10px] uppercase tracking-widest font-semibold">{label}</span>
          </Link>
        ))}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
