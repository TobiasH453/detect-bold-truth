import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { DetectScreen } from "@/components/DetectScreen";

export const Route = createFileRoute("/detect/photo")({
  component: PhotoPage,
});

function PhotoPage() {
  return (
    <DetectScreen
      type="photo"
      title="Analyze a photo."
      description="Upload an image and we'll check if it was AI-generated."
    >
      {({ setPreview, setCanSubmit }) => (
        <PhotoPicker
          onFile={(name, dataUrl) => {
            setPreview(`photo:${name}`);
            setCanSubmit(true);
            // dataUrl is used for client display only
            void dataUrl;
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

function PhotoPicker({
  onFile,
  onClear,
}: {
  onFile: (name: string, dataUrl: string) => void;
  onClear: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState<string>("");

  const handle = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setPreview(url);
      setName(file.name);
      onFile(file.name, url);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handle(e.target.files[0])}
      />
      {!preview ? (
        <button
          onClick={() => ref.current?.click()}
          className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-foreground bg-surface flex flex-col items-center justify-center gap-2 text-foreground"
        >
          <Upload className="size-7" />
          <div className="font-semibold">Tap to upload</div>
          <div className="text-xs text-muted-foreground">PNG · JPG · WEBP</div>
        </button>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border-2 border-foreground shadow-pop-sm">
          <img src={preview} alt={name} className="w-full aspect-[4/3] object-cover" />
          <button
            onClick={() => {
              setPreview(null);
              setName("");
              if (ref.current) ref.current.value = "";
              onClear();
            }}
            className="absolute top-2 right-2 size-8 rounded-full bg-foreground text-background flex items-center justify-center shadow-pop-sm"
            aria-label="Remove"
          >
            <X className="size-4" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-foreground/80 text-background text-xs px-3 py-1.5 truncate">
            {name}
          </div>
        </div>
      )}
    </div>
  );
}
