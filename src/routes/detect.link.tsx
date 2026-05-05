import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DetectScreen } from "@/components/DetectScreen";

export const Route = createFileRoute("/detect/link")({
  component: LinkPage,
});

function LinkPage() {
  return (
    <DetectScreen
      type="link"
      title="Analyze a link."
      description="Paste a URL to a photo, video, or text page."
    >
      {({ setPreview, setCanSubmit }) => (
        <LinkInput onChange={(v, ok) => { setPreview(v); setCanSubmit(ok); }} />
      )}
    </DetectScreen>
  );
}

function LinkInput({ onChange }: { onChange: (v: string, ok: boolean) => void }) {
  const [val, setVal] = useState("");
  const [valid, setValid] = useState(false);
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
