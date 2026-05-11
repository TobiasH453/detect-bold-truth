import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Share2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { getAnalysis, type Analysis } from "@/lib/profile";

export const Route = createFileRoute("/result/$id")({
  component: ResultPage,
});

function ResultPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [a, setA] = useState<Analysis | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getAnalysis(id).then((data) => {
      if (!data) setNotFound(true);
      else setA(data);
    });
  }, [id]);

  if (notFound) {
    return (
      <AppShell>
        <p className="mt-10 text-center text-muted-foreground">Result not found.</p>
      </AppShell>
    );
  }
  if (!a) {
    return (
      <AppShell>
        <div className="mt-10 text-center text-muted-foreground">Loading…</div>
      </AppShell>
    );
  }

  const verdictLabel = a.verdict === "likely_ai" ? "Likely AI" : a.verdict === "likely_human" ? "Likely human" : "Uncertain";
  const isAI = a.verdict === "likely_ai";

  const share = async () => {
    const text = `AIsore result: ${verdictLabel} · ${a.score}/100 · suspected ${a.suspected_model}`;
    try {
      if (navigator.share) await navigator.share({ text, title: "AIsore" });
      else {
        await navigator.clipboard.writeText(text);
        toast.success("Result copied");
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <AppShell>
      <button
        onClick={() => navigate({ to: "/" })}
        className="flex items-center gap-1 text-sm font-semibold text-muted-foreground mt-2 mb-4"
      >
        <ArrowLeft className="size-4" /> Back
      </button>

      <div className={`rounded-3xl border-2 border-foreground p-6 shadow-pop ${isAI ? "bg-primary text-primary-foreground" : "bg-foreground text-background"}`}>
        <div className="text-[10px] uppercase tracking-widest font-semibold opacity-80">
          AI Confidence
        </div>
        <div className="mt-1 flex items-baseline gap-2 font-display">
          <span className="text-7xl font-bold leading-none">{a.score}</span>
          <span className="text-2xl font-semibold opacity-70">/100</span>
        </div>
        <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full border-2 border-current text-sm font-semibold">
          {verdictLabel}
        </div>
      </div>

      <div className="mt-4">
        <Stat label="Type" value={a.content_type} />
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-surface p-5">
        <div className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">Suspected model</div>
        <div className="mt-1 font-display text-2xl font-bold">{a.suspected_model}</div>
        {a.input_preview && (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{a.input_preview}</p>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link
          to="/"
          className="rounded-xl bg-foreground text-background font-semibold py-3.5 text-center shadow-pop-sm border-2 border-foreground active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-transform"
        >
          Analyze another
        </Link>
        <button
          onClick={share}
          className="rounded-xl bg-card text-foreground font-semibold py-3.5 shadow-pop-sm border-2 border-foreground active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-transform flex items-center justify-center gap-2"
        >
          <Share2 className="size-4" /> Share
        </button>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-xl font-semibold capitalize">{value}</div>
    </div>
  );
}
