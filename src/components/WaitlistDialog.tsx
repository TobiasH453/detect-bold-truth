import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function WaitlistDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) || trimmed.length > 255) {
      setErrorMsg("Please enter a valid email.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    const { error } = await supabase.from("waitlist_signups").insert({ email: trimmed });
    // Treat duplicate as success (they're already on the list)
    if (error && !error.message.toLowerCase().includes("duplicate")) {
      setErrorMsg("Something went wrong. Try again.");
      setStatus("error");
      return;
    }
    setStatus("done");
  };

  const handleClose = () => {
    setEmail("");
    setStatus("idle");
    setErrorMsg("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md bg-background border-2 border-foreground rounded-2xl shadow-pop p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-3 right-3 size-9 rounded-lg border-2 border-foreground bg-background hover:bg-foreground hover:text-background transition-colors flex items-center justify-center"
        >
          <X className="size-4" />
        </button>

        {status === "done" ? (
          <div className="text-center pt-2">
            <h2 className="font-display font-bold text-2xl tracking-tight">
              Thanks for signing up.
            </h2>
            <p className="mt-3 text-muted-foreground">
              You'll be the first to know when AIsore drops.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h2 className="font-display font-bold text-2xl tracking-tight">
                Join the waitlist
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Drop your email — we'll ping you the moment AIsore goes live.
              </p>
            </div>
            <input
              type="email"
              required
              autoFocus
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              maxLength={255}
              className="w-full rounded-xl border-2 border-foreground bg-background px-4 py-3 font-sans text-base focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {status === "error" && (
              <p className="text-sm text-destructive">{errorMsg}</p>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-foreground text-background font-display font-bold text-lg py-3 rounded-xl border-2 border-foreground shadow-pop-sm hover:opacity-85 transition-opacity disabled:opacity-60"
            >
              {status === "loading" ? "Submitting..." : "Notify me"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
