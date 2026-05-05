import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, Check } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth-context";
import { fetchProfile, setPlan, type Profile } from "@/lib/profile";

export const Route = createFileRoute("/account")({
  component: AccountPage,
});

function AccountPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!user) return;
    setProfile(await fetchProfile(user.id, user.email));
  };

  useEffect(() => {
    load();
  }, [user]);

  const upgrade = async () => {
    if (!user) return;
    setBusy(true);
    try {
      const p = await setPlan(user.id, "pro");
      setProfile(p);
      toast.success("You're on Pro — 300 credits added.");
    } catch (e) {
      toast.error("Upgrade failed");
    } finally {
      setBusy(false);
    }
  };

  const cancel = async () => {
    if (!user) return;
    setBusy(true);
    try {
      const p = await setPlan(user.id, "free");
      setProfile(p);
      toast.success("Plan cancelled. You're back on Free.");
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  if (!profile) {
    return (
      <AppShell>
        <p className="mt-10 text-center text-muted-foreground">Loading…</p>
      </AppShell>
    );
  }

  const reset = new Date(profile.credits_reset_at);
  const isPro = profile.plan === "pro";

  return (
    <AppShell>
      <h1 className="font-display text-3xl font-bold mt-3">Account</h1>
      <p className="mt-1 text-sm text-muted-foreground truncate">{profile.email}</p>

      <div className="mt-6 rounded-3xl border-2 border-foreground bg-foreground text-background p-6 shadow-pop">
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-widest font-semibold opacity-70">
            Credits remaining
          </div>
          <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-1 border border-current rounded-full">
            {profile.plan}
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-2 font-display">
          <span className="text-6xl font-bold">{profile.credits_remaining}</span>
          <span className="text-xl opacity-60">/ {isPro ? 300 : 30}</span>
        </div>
        <div className="mt-3 text-xs opacity-70">
          Resets {reset.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
        </div>
      </div>

      {!isPro ? (
        <div className="mt-5 rounded-3xl border-2 border-foreground bg-primary text-primary-foreground p-6 shadow-pop">
          <div className="text-[10px] uppercase tracking-widest font-semibold opacity-80">Upgrade</div>
          <div className="mt-1 font-display text-3xl font-bold">AIsore Pro</div>
          <div className="mt-1 text-sm opacity-90">300 credits every month.</div>
          <ul className="mt-4 space-y-1.5 text-sm">
            <Bullet>10× more credits</Bullet>
            <Bullet>Priority queue</Bullet>
            <Bullet>Cancel anytime</Bullet>
          </ul>
          <button
            disabled={busy}
            onClick={upgrade}
            className="mt-5 w-full rounded-xl bg-background text-foreground font-semibold py-3.5 shadow-pop-sm border-2 border-foreground active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-transform disabled:opacity-60"
          >
            {busy ? "Upgrading…" : "Upgrade — $3.99 / month"}
          </button>
        </div>
      ) : (
        <div className="mt-5 rounded-3xl border border-border bg-card p-6">
          <div className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">Plan</div>
          <div className="mt-1 font-display text-2xl font-bold">AIsore Pro · $3.99/mo</div>
          <button
            onClick={cancel}
            disabled={busy}
            className="mt-5 w-full rounded-xl bg-card text-foreground font-semibold py-3 border-2 border-foreground shadow-pop-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-transform disabled:opacity-60"
          >
            Cancel plan
          </button>
        </div>
      )}

      <button
        onClick={handleSignOut}
        className="mt-8 w-full flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground py-3"
      >
        <LogOut className="size-4" /> Log out
      </button>
    </AppShell>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <Check className="size-4 shrink-0" />
      <span>{children}</span>
    </li>
  );
}
