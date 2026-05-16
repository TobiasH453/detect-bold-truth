import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo, Wordmark } from "@/components/Logo";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms of Service — AIsore" },
      {
        name: "description",
        content:
          "AIsore terms of service: use the app responsibly, results are informational, and we aren't liable for anything that doesn't come directly from us.",
      },
    ],
    links: [{ rel: "canonical", href: "https://aisoreapp.com/terms" }],
  }),
});

function TermsPage() {
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
        <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight">Terms of Service</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed">
          <section>
            <h2 className="font-display font-bold text-2xl mb-3">Using AIsore</h2>
            <p className="text-muted-foreground">
              Use AIsore lawfully and don't try to break, abuse, or reverse-engineer it. Don't submit content you
              don't have the right to submit.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl mb-3">Results are informational</h2>
            <p className="text-muted-foreground">
              While detection results use the best available models, there is no warranty of accuracy. You're
              responsible for any decisions you make based on them.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl mb-3">Limitation of liability</h2>
            <p className="text-muted-foreground">
              To the maximum extent permitted by law, AIsore is not liable for any loss, damage, or claim arising
              from the content you submit or encounter, actions taken based on a result, third-party services or
              content accessed through the app, or anything not directly produced or published by AIsore.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl mb-3">Changes</h2>
            <p className="text-muted-foreground">
              We may update these terms as the product evolves. Continued use means you accept the latest version.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
