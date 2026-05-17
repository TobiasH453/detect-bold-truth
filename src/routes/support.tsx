import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Copy, Check, ArrowLeft, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Logo, Wordmark } from "@/components/Logo";

const PLATFORMS = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube-shorts", label: "YouTube Shorts" },
  { value: "tiktok", label: "TikTok" },
  { value: "x", label: "X / Twitter" },
] as const;

export const Route = createFileRoute("/support")({
  component: SupportPage,
  head: () => ({
    meta: [
      { title: "Support — AIsore" },
      {
        name: "description",
        content:
          "Get in touch with the AIsore team and learn how to configure the app on your device.",
      },
      { property: "og:title", content: "Support — AIsore" },
      {
        property: "og:description",
        content: "Contact the AIsore team and follow setup instructions.",
      },
    ],
    links: [{ rel: "canonical", href: "https://aisoreapp.com/support" }],
  }),
});

function SupportPage() {
  const [contactOpen, setContactOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [platform, setPlatform] = useState<string | undefined>(undefined);
  const email = "support@aisoreapp.com";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="border-b-2 border-foreground">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={24} />
            <Wordmark className="text-base" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" /> Home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-14">
        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground">
          Support
        </span>
        <h1 className="mt-3 font-display font-bold text-balance text-[clamp(40px,6vw,64px)] leading-[1] tracking-tight">
          Need a hand?
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-xl">
          Get the most out of AIsore. Contact us if you need more help.
        </p>

        <section className="mt-12">
          <Collapsible open={instructionsOpen} onOpenChange={setInstructionsOpen}>
            <CollapsibleTrigger className="group w-full flex items-center justify-between gap-4 rounded-2xl border-2 border-foreground bg-card px-5 py-4 text-left shadow-pop-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
              <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight">
                Setting up AIsore sharing (iOS)
              </h2>
              <ChevronDown className="size-5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-4 rounded-2xl border-2 border-foreground bg-card p-5">
                <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground">
                  Choose a platform
                </label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger className="mt-2 border-2 border-foreground rounded-xl h-11">
                    <SelectValue placeholder="Select a platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {platform ? (
                  <div className="mt-5 rounded-xl border-2 border-dashed border-foreground/30 bg-surface p-6 text-sm text-muted-foreground">
                    Instructions for{" "}
                    <span className="font-semibold text-foreground">
                      {PLATFORMS.find((p) => p.value === platform)?.label}
                    </span>{" "}
                    will go here.
                  </div>
                ) : (
                  <p className="mt-5 text-sm text-muted-foreground">
                    Pick a platform above to see the setup steps.
                  </p>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </section>

        <div className="mt-16">
          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold text-sm px-5 py-3 rounded-xl border-2 border-foreground shadow-pop-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            <Mail className="size-4" />
            Contact us
          </button>
        </div>
      </main>

      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="border-2 border-foreground rounded-2xl shadow-pop sm:max-w-md">
          <DialogHeader>
            <div className="size-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center border-2 border-foreground">
              <Mail className="size-5" />
            </div>
            <DialogTitle className="font-display text-2xl mt-3">Contact & Support</DialogTitle>
            <DialogDescription>Bugs, questions, suggestions</DialogDescription>
          </DialogHeader>

          <div className="mt-2 flex items-center gap-2 rounded-xl border-2 border-foreground bg-surface px-3 py-2">
            <Mail className="size-4 shrink-0 text-muted-foreground" />
            <span className="font-mono text-sm truncate flex-1">{email}</span>
            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md border border-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <a
            href={`mailto:${email}`}
            className="mt-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-display font-bold text-sm px-5 py-3 rounded-xl border-2 border-foreground shadow-pop-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            <Mail className="size-4" />
            Open email app
          </a>
        </DialogContent>
      </Dialog>
    </div>
  );
}
