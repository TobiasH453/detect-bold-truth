import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Image, Type, Video, Link as LinkIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { listAnalyses, type Analysis } from "@/lib/profile";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
});

const ICONS = {
  photo: Image,
  video: Video,
  text: Type,
  link: LinkIcon,
} as const;

function HistoryPage() {
  const [items, setItems] = useState<Analysis[] | null>(null);

  useEffect(() => {
    listAnalyses().then(setItems);
  }, []);

  return (
    <AppShell>
      <h1 className="font-display text-3xl font-bold mt-3">History</h1>
      <p className="mt-1 text-sm text-muted-foreground">Everything you've analyzed.</p>

      <div className="mt-6 space-y-2">
        {items === null && <p className="text-sm text-muted-foreground">Loading…</p>}
        {items?.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">No analyses yet.</p>
            <Link to="/" className="inline-block mt-3 text-sm font-semibold text-primary">
              Try one →
            </Link>
          </div>
        )}
        {items?.map((a) => {
          const Icon = ICONS[a.content_type];
          const isAI = a.verdict === "likely_ai";
          return (
            <Link
              key={a.id}
              to="/result/$id"
              params={{ id: a.id }}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 hover:border-foreground transition-colors"
            >
              <div className="size-11 rounded-xl bg-surface flex items-center justify-center">
                <Icon className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold capitalize">
                  {a.content_type} · {a.suspected_model}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {a.input_preview || "—"}
                </div>
              </div>
              <div
                className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold border-2 border-foreground ${
                  isAI ? "bg-primary text-primary-foreground" : "bg-card"
                }`}
              >
                {a.score}
              </div>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
