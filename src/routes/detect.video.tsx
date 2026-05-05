import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { DetectScreen } from "@/components/DetectScreen";

export const Route = createFileRoute("/detect/video")({
  component: VideoPage,
});

function VideoPage() {
  return (
    <DetectScreen
      type="video"
      title="Analyze a video."
      description="Up to 30 seconds. We'll inspect for AI-generated motion."
    >
      {({ setPreview, setCanSubmit }) => (
        <VideoPicker
          onFile={(name) => {
            setPreview(`video:${name}`);
            setCanSubmit(true);
          }}
          onClear={() => {
            setPreview("");
            setCanSubmit(false);
          }}
        />
      )}
    </DetectScreen>
  );
}

function VideoPicker({ onFile, onClear }: { onFile: (n: string) => void; onClear: () => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState<number | null>(null);

  const handle = (file: File) => {
    if (!file.type.startsWith("video/")) return;
    const objectUrl = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.preload = "metadata";
    v.src = objectUrl;
    v.onloadedmetadata = () => {
      if (v.duration > 30.5) {
        URL.revokeObjectURL(objectUrl);
        toast.error(`Video is ${v.duration.toFixed(1)}s — max is 30s.`);
        if (ref.current) ref.current.value = "";
        return;
      }
      setUrl(objectUrl);
      setName(file.name);
      setDuration(v.duration);
      onFile(file.name);
    };
  };

  return (
    <div>
      <input
        ref={ref}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handle(e.target.files[0])}
      />
      {!url ? (
        <button
          onClick={() => ref.current?.click()}
          className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-foreground bg-surface flex flex-col items-center justify-center gap-2"
        >
          <Upload className="size-7" />
          <div className="font-semibold">Tap to upload</div>
          <div className="text-xs text-muted-foreground">MP4 · MOV · WEBM · max 30s</div>
        </button>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border-2 border-foreground shadow-pop-sm bg-black">
          <video src={url} controls className="w-full aspect-[4/3] object-cover" />
          <button
            onClick={() => {
              if (url) URL.revokeObjectURL(url);
              setUrl(null);
              setName("");
              setDuration(null);
              if (ref.current) ref.current.value = "";
              onClear();
            }}
            className="absolute top-2 right-2 size-8 rounded-full bg-foreground text-background flex items-center justify-center shadow-pop-sm"
            aria-label="Remove"
          >
            <X className="size-4" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-foreground/85 text-background text-xs px-3 py-1.5 flex justify-between">
            <span className="truncate mr-2">{name}</span>
            {duration !== null && <span className="font-mono">{duration.toFixed(1)}s</span>}
          </div>
        </div>
      )}
    </div>
  );
}
