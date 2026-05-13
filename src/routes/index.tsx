import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Apple, Play, ShieldCheck, Zap, Eye } from "lucide-react";
import { Logo, Wordmark } from "@/components/Logo";
import { WaitlistDialog } from "@/components/WaitlistDialog";
import appScreenshot from "@/assets/app-screenshot.png";
import markerX from "@/assets/marker-x.png";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "AIsore — Never wonder if it's AI" },
      {
        name: "description",
        content:
          "Detect AI-generated photos, videos, and text in seconds. Get a confidence score and the likely model. Download AIsore for iOS and Android.",
      },
      { property: "og:title", content: "AIsore — Never wonder if it's AI" },
      {
        property: "og:description",
        content: "Scan any photo, video, or text for AI fingerprints. Get a confidence score in seconds.",
      },
      { property: "og:url", content: "https://aisoreapp.com/" },
    ],
    links: [{ rel: "canonical", href: "https://aisoreapp.com/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "AIsore",
          url: "https://aisoreapp.com/",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "AIsore",
          url: "https://aisoreapp.com/",
        }),
      },
    ],
  }),
});

function Landing() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const openWaitlist = () => setWaitlistOpen(true);
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Hero onOpenWaitlist={openWaitlist} />
      <HowItWorks />
      <CTA onOpenWaitlist={openWaitlist} />
      <Footer />
      <WaitlistDialog open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </div>
  );
}

function Hero({ onOpenWaitlist }: { onOpenWaitlist: () => void }) {
  return (
    <section className="relative overflow-hidden border-b-2 border-foreground">
      <div className="absolute inset-0 -z-10 opacity-[0.04] [background-image:radial-gradient(var(--color-foreground)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-14 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold border border-foreground rounded-full px-3 py-1">
            <span className="size-1.5 rounded-full bg-primary" /> AI Detection · iOS & Android
          </span>
          <h1 className="mt-6 font-display font-bold text-balance text-[clamp(48px,7vw,84px)] leading-[0.95] tracking-tight">
            Never wonder<br />
            <span className="text-primary">if it's AI.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-md">
            Scan or share any photo, video, or text for AI fingerprints. Get an honest confidence score
            and the likely model in under 10 seconds.
          </p>
          <DownloadGroup onOpenWaitlist={onOpenWaitlist} align="left" />
        </div>

        <PhoneMock />
      </div>
    </section>
  );
}

function PhoneMock() {
  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      <div className="absolute -inset-6 bg-primary/15 rounded-[60px] blur-2xl -z-10" />
      <img
        src={appScreenshot}
        alt="AIsore app screenshot"
        className="relative w-full h-auto rounded-[36px] border-2 border-foreground shadow-pop"
      />
    </div>
  );
}

function DownloadGroup({
  onOpenWaitlist,
  align,
}: {
  onOpenWaitlist: () => void;
  align: "left" | "center";
}) {
  return (
    <div
      id="download"
      className={`mt-10 flex flex-col gap-4 items-center ${align === "center" ? "md:items-center" : "md:items-start"}`}
    >
      <div className="relative inline-block">
        <div className="flex flex-wrap gap-3 justify-center">
          <StoreButton kind="ios" />
          <StoreButton kind="android" />
        </div>
        {/* Hand-painted brushstroke X stretched over both buttons */}
        <img
          src={markerX}
          alt=""
          aria-hidden="true"
          className="absolute left-[calc(50%+14px)] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[64%] h-[71%] md:w-[128%] md:h-[142%] pointer-events-none select-none"
          style={{ objectFit: "fill", opacity: 1 }}
          draggable={false}
        />

      </div>
      <button
        onClick={onOpenWaitlist}
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold text-sm px-5 py-2.5 rounded-xl border-2 border-foreground shadow-pop-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
      >
        Public beta soon · Join the waitlist
      </button>
    </div>
  );
}

function StoreButton({ kind }: { kind: "ios" | "android" }) {
  const isIos = kind === "ios";
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      aria-disabled="true"
      className="inline-flex items-center gap-3 bg-foreground text-background pl-4 pr-5 py-3 rounded-2xl border-2 border-foreground opacity-70 cursor-not-allowed pointer-events-none"
    >
      {isIos ? <Apple className="size-7" /> : <Play className="size-7 fill-current" />}
      <div className="text-left leading-tight">
        <div className="text-[10px] uppercase tracking-widest opacity-70">
          {isIos ? "Download on the" : "Get it on"}
        </div>
        <div className="font-display font-bold text-lg">
          {isIos ? "App Store" : "Google Play"}
        </div>
      </div>
    </a>
  );
}

function Trio() {
  const items = [
    {
      icon: <Eye className="size-6" />,
      title: "Catch AI fingerprints",
      body: "Detection trained on the latest generators across photos, videos, and text.",
    },
    {
      icon: <Zap className="size-6" />,
      title: "Seconds, not minutes",
      body: "Paste a link or upload from your camera roll. Results land before your coffee cools.",
    },
    {
      icon: <ShieldCheck className="size-6" />,
      title: "Private by default",
      body: "Your scans don't train anyone's model. We process and forget.",
    },
  ];
  return (
    <section id="features" className="border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-6">
        {items.map((it) => (
          <div
            key={it.title}
            className="rounded-2xl border-2 border-foreground bg-card p-6 shadow-pop-sm"
          >
            <div className="size-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
              {it.icon}
            </div>
            <h3 className="mt-5 font-display text-xl font-bold">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Drop it in", body: "Paste a link, or upload a photo, video, or block of text." },
    { n: "02", title: "We analyze", body: "Our models see what you can't. Pixel patterns, prose tics, frame artifacts." },
    { n: "03", title: "Get the verdict", body: "A confidence score, the likely AI model, and an easy way to share." },
  ];
  return (
    <section id="how" className="bg-surface border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-2xl">
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground">
            How it works
          </span>
          <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl tracking-tight">
            Three taps to the truth.
          </h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl bg-background border border-border p-6">
              <div className="font-mono text-primary font-bold text-sm">{s.n}</div>
              <h3 className="mt-3 font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA({ onOpenWaitlist }: { onOpenWaitlist: () => void }) {
  return (
    <section className="border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="font-display font-bold text-balance text-[clamp(40px,6vw,68px)] leading-[1] tracking-tight">
          Stop second-guessing<br />what you see.
        </h2>
        <p className="mt-5 text-lg text-muted-foreground max-w-lg mx-auto">
          AIsore lives in your pocket. Scan anything, anywhere.
        </p>
        <div className="mt-9 flex justify-center">
          <DownloadGroup onOpenWaitlist={onOpenWaitlist} align="center" />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Logo size={20} />
          <Wordmark className="text-base" />
          <span className="opacity-60">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-foreground transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
