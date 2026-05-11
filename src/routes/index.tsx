import { createFileRoute } from "@tanstack/react-router";
import { Apple, Play, ShieldCheck, Zap, Eye } from "lucide-react";
import { Logo, Wordmark } from "@/components/Logo";
import appScreenshot from "@/assets/app-screenshot.png";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "AIsore — Never wonder if it's AI" },
      {
        name: "description",
        content:
          "Detect AI-generated photos, videos, and text in seconds. Download AIsore for iOS and Android.",
      },
      { property: "og:title", content: "AIsore — Never wonder if it's AI" },
      {
        property: "og:description",
        content: "Scan any photo, video, or text for AI fingerprints. Get a confidence score in seconds.",
      },
    ],
  }),
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SiteHeader />
      <Hero />
      
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <Logo size={32} />
          <Wordmark className="text-xl" />
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#how" className="hover:text-primary transition-colors">How it works</a>
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#download" className="hover:text-primary transition-colors">Download</a>
        </nav>
        <a
          href="#download"
          className="hidden sm:inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-full text-sm font-semibold hover:opacity-85 transition-opacity"
        >
          Get the app
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b-2 border-foreground">
      <div className="absolute inset-0 -z-10 opacity-[0.04] [background-image:radial-gradient(var(--color-foreground)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold border border-foreground rounded-full px-3 py-1">
            <span className="size-1.5 rounded-full bg-primary" /> AI Detection · iOS & Android
          </span>
          <h1 className="mt-6 font-display font-bold text-balance text-[clamp(48px,7vw,84px)] leading-[0.95] tracking-tight">
            Never wonder<br />
            <span className="text-primary">if it's AI.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-md">
            Scan any photo, video, or text for AI fingerprints. Get an honest confidence score
            and the likely model in under 10 seconds.
          </p>
          <div id="download" className="mt-10 flex flex-wrap gap-3">
            <StoreButton kind="ios" />
            <StoreButton kind="android" />
          </div>
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
      <div className="relative aspect-[9/19] rounded-[44px] border-[3px] border-foreground bg-background shadow-pop overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-7 flex justify-center">
          <div className="mt-2 h-5 w-24 rounded-full bg-foreground" />
        </div>
        <div className="pt-12 px-5 pb-6 h-full flex flex-col">
          <div className="flex items-center gap-2">
            <Logo size={24} />
            <Wordmark className="text-base" />
          </div>
          <h3 className="mt-6 font-display text-3xl font-bold leading-tight">Never wonder.</h3>
          <p className="mt-1 text-xs text-muted-foreground">Scan any content for AI fingerprints.</p>

          <div className="mt-5 rounded-2xl border-2 border-foreground bg-card shadow-pop-sm p-3 text-xs text-muted-foreground">
            https://…
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { icon: <Type className="size-4" />, label: "Text", c: 2 },
              { icon: <ImageIcon className="size-4" />, label: "Photo", c: 4 },
              { icon: <Video className="size-4" />, label: "Video", c: 10 },
            ].map((t) => (
              <div
                key={t.label}
                className="rounded-2xl border-2 border-foreground bg-primary text-primary-foreground p-2 aspect-square flex flex-col justify-between shadow-pop-sm"
              >
                <div className="size-7 rounded-lg bg-primary-foreground/15 flex items-center justify-center">
                  {t.icon}
                </div>
                <div>
                  <div className="font-display text-sm font-bold leading-none">{t.label}</div>
                  <div className="text-[8px] uppercase tracking-widest font-semibold opacity-80 mt-0.5">
                    {t.c} cr
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto rounded-xl border border-border bg-surface p-3">
            <div className="text-[9px] uppercase tracking-widest font-semibold text-muted-foreground">
              Last scan
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="font-display font-bold">Likely AI</span>
              <span className="text-xs font-mono font-semibold text-primary">94%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoreButton({ kind }: { kind: "ios" | "android" }) {
  const isIos = kind === "ios";
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className="group inline-flex items-center gap-3 bg-foreground text-background pl-4 pr-5 py-3 rounded-2xl border-2 border-foreground shadow-pop-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
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
    { n: "03", title: "Get the verdict", body: "A confidence score, the likely AI model, and a plain-English explanation." },
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

function CTA() {
  return (
    <section className="border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="font-display font-bold text-balance text-[clamp(40px,6vw,68px)] leading-[1] tracking-tight">
          Stop second-guessing<br />what you see.
        </h2>
        <p className="mt-5 text-lg text-muted-foreground max-w-lg mx-auto">
          AIsore lives in your pocket. Scan anything, anywhere.
        </p>
        <div className="mt-9 flex flex-wrap gap-3 justify-center">
          <StoreButton kind="ios" />
          <StoreButton kind="android" />
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
