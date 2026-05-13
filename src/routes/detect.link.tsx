import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { DetectScreen } from "@/components/DetectScreen";

const searchSchema = z.object({
  url: z.string().optional(),
});

export const Route = createFileRoute("/detect/link")({
  component: LinkPage,
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Analyze a link for AI — AIsore" },
      { name: "description", content: "Paste a URL to a photo, video, or text page and AIsore will fetch and inspect the linked content for AI fingerprints." },
      { property: "og:title", content: "Analyze a link for AI — AIsore" },
      { property: "og:description", content: "Paste a URL and AIsore will inspect the linked content for AI fingerprints." },
      { property: "og:url", content: "https://aisoreapp.com/detect/link" },
    ],
    links: [{ rel: "canonical", href: "https://aisoreapp.com/detect/link" }],
  }),
});

function LinkPage() {
  const { url: initialUrl } = Route.useSearch();
  return (
    <DetectScreen
      type="link"
      title="Analyze a link."
      description="Paste a URL to a photo, video, or text page."
    >
      {({ setPreview, setCanSubmit }) => (
        <LinkInput
          initial={initialUrl ?? ""}
          onChange={(v, ok) => { setPreview(v); setCanSubmit(ok); }}
        />
      )}
    </DetectScreen>
  );
}

function LinkInput({ initial, onChange }: { initial: string; onChange: (v: string, ok: boolean) => void }) {
  const [val, setVal] = useState(initial);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    if (initial) {
      const ok = /^https?:\/\/.+\..+/i.test(initial);
      setValid(ok);
      onChange(initial, ok);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <input
        type="url"
        inputMode="url"
        value={val}
        placeholder="https://…"
        onChange={(e) => {
          const v = e.target.value.trim();
          setVal(v);
          const ok = /^https?:\/\/.+\..+/i.test(v);
          setValid(ok);
          onChange(v, ok);
        }}
        className="w-full rounded-2xl border-2 border-foreground bg-card px-4 py-4 text-base focus:outline-none focus:ring-2 focus:ring-primary shadow-pop-sm"
      />
      <p className="mt-2 text-xs text-muted-foreground">
        {val && !valid ? "Enter a valid http(s) URL." : "We'll fetch and inspect the linked content."}
      </p>
    </div>
  );
}
