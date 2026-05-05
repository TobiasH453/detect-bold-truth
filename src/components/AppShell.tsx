import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Sparkles, History, User as UserIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { fetchProfile, type Profile } from "@/lib/profile";
import { Logo, Wordmark } from "./Logo";

interface Props {
  children: ReactNode;
  showNav?: boolean;
}

export function AppShell({ children, showNav = true }: Props) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [loading, user, navigate]);

  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => {
    if (!user) return;
    fetchProfile(user.id, user.email).then(setProfile);
  }, [user, location.pathname]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Logo size={48} pulse />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-[520px] flex-1 flex flex-col relative">
        <Header profile={profile} />
        <main className="flex-1 pb-28 px-5 pt-3">{children}</main>
        {showNav && <BottomNav />}
      </div>
    </div>
  );
}

function Header({ profile }: { profile: Profile | null }) {
  return (
    <header className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Logo size={28} />
          <Wordmark className="text-lg" />
        </Link>
        <div className="flex items-center gap-2">
          {profile && (
            <>
              <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-1 border border-foreground rounded-full">
                {profile.plan}
              </span>
              <Link
                to="/account"
                className="text-xs font-mono font-semibold bg-foreground text-background px-2.5 py-1 rounded-full hover:opacity-80 transition-opacity"
              >
                {profile.credits_remaining} <span className="opacity-60">credits</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function BottomNav() {
  const items = [
    { to: "/", icon: Sparkles, label: "Detect" },
    { to: "/history", icon: History, label: "History" },
    { to: "/account", icon: UserIcon, label: "Account" },
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
