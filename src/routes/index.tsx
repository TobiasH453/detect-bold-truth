import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Image, Type, Video, Link as LinkIcon, ArrowRight } from "lucide-react";
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

  return (
    <AppShell>
      <section className="pt-4">
        <h1 className="font-display text-[34px] leading-[1.05] font-bold text-balance">
          See what's real.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-[28ch]">
          Pick a content type to scan it for AI fingerprints.
        </p>
      </section>

      <section className="mt-7 grid grid-cols-2 gap-3">
        <Tile to="/detect/photo" icon={<Image className="size-6" strokeWidth={2} />} label="Photo" cost={2} accent />
        <Tile to="/detect/video" icon={<Video className="size-6" strokeWidth={2} />} label="Video" cost={10} />
        <Tile to="/detect/text" icon={<Type className="size-6" strokeWidth={2} />} label="Text" cost={2} />
        <Tile to="/detect/link" icon={<LinkIcon className="size-6" strokeWidth={2} />} label="Link" cost={2} />
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
  accent,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  cost: number;
  accent?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`group rounded-2xl border-2 border-foreground p-4 aspect-[1.05] flex flex-col justify-between transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-pop-sm ${
        accent ? "bg-primary text-primary-foreground" : "bg-card"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className={`size-10 rounded-xl flex items-center justify-center ${
          accent ? "bg-primary-foreground/15 text-primary-foreground" : "bg-foreground text-background"
        }`}>
          {icon}
        </div>
        <ArrowRight className="size-4 opacity-60 group-hover:opacity-100" />
      </div>
      <div>
        <div className="font-display text-2xl font-bold">{label}</div>
        <div className="text-[11px] uppercase tracking-widest font-semibold opacity-70 mt-0.5">
          {cost} credits
        </div>
      </div>
    </Link>
  );
}
