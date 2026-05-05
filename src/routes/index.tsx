import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Image, Type, Video, ArrowRight, Link2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  const [url, setUrl] = useState("");
  const valid = /^https?:\/\/.+\..+/i.test(url.trim());

  const submitLink = () => {
    if (!valid) return;
    navigate({ to: "/detect/link", search: { url: url.trim() } as never });
  };

  return (
    <AppShell>
      <section className="pt-4">
        <h1 className="font-display text-[34px] leading-[1.05] font-bold text-balance">
          See what's real.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-[28ch]">
          Scan any content for AI fingerprints.
        </p>
      </section>

      <section className="mt-6">
        <label className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
          Paste a link
        </label>
        <div className="mt-2 rounded-2xl border-2 border-foreground bg-card shadow-pop-sm overflow-hidden flex items-stretch">
          <div className="pl-4 flex items-center text-muted-foreground">
            <Link2 className="size-5" />
          </div>
          <input
            type="url"
            inputMode="url"
            value={url}
            placeholder="https://…"
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submitLink(); }}
            className="flex-1 bg-transparent px-3 py-4 text-base focus:outline-none"
          />
          <button
            onClick={submitLink}
            disabled={!valid}
            className="bg-primary text-primary-foreground px-4 font-semibold border-l-2 border-foreground disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            Scan <ArrowRight className="size-4" />
          </button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Works for photos, videos, or text pages.
        </p>
      </section>

      <section className="mt-8">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
          Or choose an option to upload
        </p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <Tile to="/detect/text" icon={<Type className="size-6" strokeWidth={2} />} label="Text" cost={2} />
          <Tile to="/detect/photo" icon={<Image className="size-6" strokeWidth={2} />} label="Photo" cost={4} />
          <Tile to="/detect/video" icon={<Video className="size-6" strokeWidth={2} />} label="Video" cost={10} />
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-surface p-5">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
          How it works
        </p>
        <ol className="mt-3 space-y-2 text-sm">
          <li className="flex gap-2"><span className="font-mono text-primary font-semibold">01</span>Upload or paste content.</li>
          <li className="flex gap-2"><span className="font-mono text-primary font-semibold">02</span>We analyze for AI fingerprints.</li>
          <li className="flex gap-2"><span className="font-mono text-primary font-semibold">03</span>Get a confidence score and likely model.</li>
        </ol>
      </section>
    </AppShell>
  );
}

function Tile({
  to,
  icon,
  label,
  cost,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  cost: number;
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border-2 border-foreground p-3 aspect-square flex flex-col justify-between transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-pop-sm bg-primary text-primary-foreground"
    >
      <div className="size-10 rounded-xl flex items-center justify-center bg-primary-foreground/15 text-primary-foreground">
        {icon}
      </div>
      <div>
        <div className="font-display text-lg font-bold leading-none">{label}</div>
        <div className="text-[10px] uppercase tracking-widest font-semibold opacity-80 mt-1">
          {cost} credits
        </div>
      </div>
    </Link>
  );
}
