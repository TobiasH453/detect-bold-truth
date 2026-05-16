import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo, Wordmark } from "@/components/Logo";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy — AIsore" },
      {
        name: "description",
        content:
          "AIsore's privacy policy: we don't sell your data, we don't store it unless strictly necessary, and detection results are informational only.",
      },
    ],
    links: [{ rel: "canonical", href: "https://aisoreapp.com/privacy" }],
  }),
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="border-b-2 border-foreground">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={24} />
            <Wordmark className="text-base" />
          </Link>
          <Link to="/" className="text-sm font-display font-bold hover:text-primary">
            ← Back
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="prose prose-neutral mt-10 space-y-8 text-[15px] leading-relaxed">
          <section>
            <h2 className="font-display font-bold text-2xl mb-3">The short version</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>We don't sell your data.</li>
              <li>We don't store your data unless it's absolutely necessary to provide the service.</li>
              <li>AIsore tells you what it thinks. We aren't liable for anything that doesn't come directly from us — including the content you scan or how you act on results.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl mb-3">What we collect</h2>
            <p className="text-muted-foreground">
              We only process the data strictly required to run AIsore: the photo, video, text, or link you submit
              for analysis, and minimal technical metadata (e.g. an anonymous request identifier) needed to return
              your result. Submissions are processed and discarded — we do not retain your uploads beyond what is
              necessary to generate and deliver a detection result.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl mb-3">What we don't do</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>We do not sell, rent, or share your data with third parties for advertising.</li>
              <li>We do not use your scans to train third-party AI models.</li>
              <li>We do not build advertising profiles on you.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl mb-3">Detection results & liability</h2>
            <p className="text-muted-foreground">
              AIsore provides probabilistic AI-detection results for informational purposes only. No detector is
              perfect. You are solely responsible for how you interpret and act on any result. To the maximum extent
              permitted by law, AIsore is not liable for any loss, damage, claim, or consequence arising from:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
              <li>the content you submit, encounter, or detect using the app;</li>
              <li>actions you or others take based on a detection result;</li>
              <li>third-party services, models, websites, or content accessed through the app;</li>
              <li>anything not directly produced or published by AIsore itself.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl mb-3">Waitlist email</h2>
            <p className="text-muted-foreground">
              If you join the waitlist, we store your email solely to notify you about AIsore. You can ask us to
              delete it at any time by contacting support.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl mb-3">Children</h2>
            <p className="text-muted-foreground">
              AIsore is not directed to children under 13. We do not knowingly collect data from them.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl mb-3">Changes</h2>
            <p className="text-muted-foreground">
              We may update this policy as the product evolves. Material changes will be reflected by updating the
              date above.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl mb-3">Contact</h2>
            <p className="text-muted-foreground">
              Questions or requests? Email{" "}
              <a className="text-primary font-semibold underline" href="mailto:tobiashalpern@gmail.com">
                tobiashalpern@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
