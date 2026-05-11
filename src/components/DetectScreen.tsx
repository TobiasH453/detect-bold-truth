import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "./AppShell";
import { Logo } from "./Logo";
import { analyzeMock, type ContentType } from "@/lib/profile";

interface Props {
  type: ContentType;
  title: string;
  description: string;
  children: (state: {
    setPreview: (s: string) => void;
    setText: (s: string) => void;
    canSubmit: boolean;
    setCanSubmit: (b: boolean) => void;
  }) => React.ReactNode;
}

export function DetectScreen({ type, title, description, children }: Props) {
  const navigate = useNavigate();

  const [preview, setPreview] = useState("");
  const [text, setText] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    const res = await analyzeMock({ contentType: type, preview, text });
    setBusy(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    navigate({ to: "/result/$id", params: { id: res.analysis.id } });
  };

  if (busy) {
    return (
      <AppShell showNav={false}>
        <div className="flex flex-col items-center justify-center pt-32 gap-6">
          <Logo size={88} pulse />
          <div className="text-center">
            <p className="font-display text-2xl font-bold">Analyzing…</p>
            <p className="text-sm text-muted-foreground mt-1">Looking for AI fingerprints.</p>
          </div>
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <button
        onClick={() => navigate({ to: "/" })}
        className="flex items-center gap-1 text-sm font-semibold text-muted-foreground mt-2 mb-4"
      >
        <ArrowLeft className="size-4" /> Back
      </button>
      <h1 className="font-display text-3xl font-bold">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>

      <div className="mt-6">{children({ setPreview, setText, canSubmit, setCanSubmit })}</div>

      <div className="fixed bottom-20 left-0 right-0 px-5">
        <div className="mx-auto w-full max-w-[480px]">
          <button
            disabled={!canSubmit}
            onClick={submit}
            className="w-full rounded-xl bg-primary text-primary-foreground font-semibold py-4 shadow-pop-sm border-2 border-foreground active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-transform disabled:opacity-40 disabled:active:translate-x-0 disabled:active:translate-y-0 flex items-center justify-center gap-2"
          >
            Analyze
          </button>
        </div>
      </div>
    </AppShell>
  );
}
