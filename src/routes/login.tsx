import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { Logo, Wordmark } from "@/components/Logo";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/" });
  }, [loading, user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await signIn(email.trim(), password);
    setBusy(false);
    if (error) {
      toast.error(error);
      return;
    }
    navigate({ to: "/" });
  };

  return (
    <AuthShell>
      <h1 className="font-display text-3xl font-bold">Welcome back.</h1>
      <p className="text-sm text-muted-foreground mt-1">Log in to keep detecting.</p>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
        <Field label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" required minLength={6} />
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-foreground text-background font-semibold py-3.5 shadow-pop-sm border-2 border-foreground active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-transform disabled:opacity-60"
        >
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">
        New here?{" "}
        <Link to="/signup" className="text-primary font-semibold underline-offset-2 hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center bg-background px-5">
      <div className="w-full max-w-[420px] flex-1 flex flex-col">
        <header className="pt-12 pb-8 flex items-center gap-3">
          <Logo size={36} />
          <Wordmark className="text-2xl" />
        </header>
        <div className="flex-1">{children}</div>
        <footer className="py-6 text-center text-[11px] uppercase tracking-widest text-muted-foreground">
          See what's real.
        </footer>
      </div>
    </div>
  );
}

export function Field({
  label,
  ...props
}: { label: string; value: string; onChange: (v: string) => void } & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
>) {
  const { value, onChange, ...rest } = props as any;
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground">{label}</span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border-2 border-foreground bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </label>
  );
}
