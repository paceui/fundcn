import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router"

import { AppProviders } from "@/components/builder/providers"
import { JSON_LD, seoLinks, seoMeta } from "@/lib/seo"

import appCss from "../styles.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: seoMeta,
    links: [
      ...seoLinks,
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  notFoundComponent: () => (
    <main className="container mx-auto p-4 pt-16">
      <h1>404</h1>
      <p>The requested page could not be found.</p>
    </main>
  ),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
        <Scripts />
      </body>
    </html>
  )
}
