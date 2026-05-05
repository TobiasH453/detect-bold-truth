import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { AuthShell, Field } from "./login";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const { signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/" });
  }, [loading, user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setBusy(true);
    const { error } = await signUp(email.trim(), password);
    setBusy(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Welcome to AIsore!");
    navigate({ to: "/" });
  };

  return (
    <AuthShell>
      <h1 className="font-display text-3xl font-bold">Create account.</h1>
      <p className="text-sm text-muted-foreground mt-1">Get 30 free credits every month.</p>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
        <Field label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" required minLength={6} />
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-primary text-primary-foreground font-semibold py-3.5 shadow-pop-sm border-2 border-foreground active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-transform disabled:opacity-60"
        >
          {busy ? "Creating…" : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-semibold underline-offset-2 hover:underline">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
