import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DetectScreen } from "@/components/DetectScreen";

export const Route = createFileRoute("/detect/text")({
  component: TextPage,
});

const MAX = 1000;

function TextPage() {
  return (
    <DetectScreen
      type="text"
      title="Analyze text."
      description="Paste up to 1,000 words. We'll estimate the AI-likelihood."
    >
      {({ setText, setCanSubmit }) => <TextInput onChange={(t, ok) => { setText(t); setCanSubmit(ok); }} />}
    </DetectScreen>
  );
}

function TextInput({ onChange }: { onChange: (t: string, ok: boolean) => void }) {
  const [val, setVal] = useState("");
  const words = val.trim().split(/\s+/).filter(Boolean).length;
  const over = words > MAX;
  return (
    <div>
      <textarea
        value={val}
        onChange={(e) => {
          const v = e.target.value;
          setVal(v);
          const w = v.trim().split(/\s+/).filter(Boolean).length;
          onChange(v, w > 0 && w <= MAX);
        }}
        placeholder="Paste text here…"
        rows={11}
        className={`w-full rounded-2xl border-2 ${over ? "border-destructive" : "border-foreground"} bg-card p-4 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary resize-none shadow-pop-sm`}
      />
      <div className="mt-2 flex justify-between text-xs font-mono">
        <span className={over ? "text-destructive font-semibold" : "text-muted-foreground"}>
          {words} / {MAX} words
        </span>
        {over && <span className="text-destructive font-semibold">Too long</span>}
      </div>
    </div>
  );
}
