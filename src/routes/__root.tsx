import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-bold">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-pop-sm"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "google-site-verification", content: "H5G6N44CK8AUbEhM9sH3hh8AiaH7DDoMpjiyP8SLYrk" },
      { title: "AIsore — Never wonder if it's AI" },
      { name: "description", content: "Detect AI-generated photos, videos, text, and links in seconds. Get an honest confidence score and the likely model — right from your phone." },
      { property: "og:site_name", content: "AIsore" },
      { property: "og:title", content: "AIsore — Never wonder if it's AI" },
      { property: "og:description", content: "Detect AI-generated photos, videos, text, and links in seconds. Get an honest confidence score and the likely model — right from your phone." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AIsore — Never wonder if it's AI" },
      { name: "twitter:description", content: "Detect AI-generated photos, videos, text, and links in seconds. Get an honest confidence score and the likely model — right from your phone." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a9f05793-3f2c-41a1-b19a-a1770331d58a/id-preview-229e1e65--783d89d3-eace-4eb0-b99a-6bee50c9aab9.lovable.app-1778529456120.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a9f05793-3f2c-41a1-b19a-a1770331d58a/id-preview-229e1e65--783d89d3-eace-4eb0-b99a-6bee50c9aab9.lovable.app-1778529456120.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <Outlet />
      <Toaster position="top-center" richColors closeButton />
    </>
  );
}
