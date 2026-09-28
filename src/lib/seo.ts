import type { AnyRouteMatch } from "@tanstack/react-router"

const SITE_URL = "https://fundcn.paceui.com"
const SITE_NAME = "Fundcn"
const SITE_TITLE = "Funding & Sponsorship Components for React - Fundcn"
const SITE_DESCRIPTION =
  "Beautiful, copy-paste funding and sponsorship components for your React apps, built on shadcn/ui"
const OG_IMAGE = `${SITE_URL}/images/og-image.jpg`
const OG_IMAGE_ALT =
  "Fundcn – copy-paste funding and sponsorship components for React apps"

export const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo/logo.jpg`,
      },
      sameAs: ["https://x.com/paceui_", "https://github.com/paceui/fundcn"],
    },
    {
      "@type": "SoftwareSourceCode",
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      codeRepository: "https://github.com/paceui/fundcn",
      programmingLanguage: "TypeScript",
      runtimePlatform: "React",
      isAccessibleForFree: true,
    },
  ],
}

export const seoMeta: NonNullable<AnyRouteMatch["meta"]> = [
  { charSet: "utf-8" },
  { name: "viewport", content: "width=device-width, initial-scale=1" },
  { title: SITE_TITLE },
  { name: "description", content: SITE_DESCRIPTION },
  {
    name: "keywords",
    content:
      "fundcn, funding components, sponsorship components, sponsor page, backer grid, funding tiers, react sponsor components, shadcn sponsor, github sponsors page, open source funding",
  },
  { name: "author", content: "PaceUI" },
  { name: "application-name", content: SITE_NAME },
  { name: "robots", content: "index, follow" },
  {
    name: "theme-color",
    media: "(prefers-color-scheme: light)",
    content: "#ffffff",
  },
  {
    name: "theme-color",
    media: "(prefers-color-scheme: dark)",
    content: "#000000",
  },
  { name: "color-scheme", content: "light dark" },
  { name: "format-detection", content: "telephone=no" },
  { name: "mobile-web-app-capable", content: "yes" },
  { name: "apple-mobile-web-app-capable", content: "yes" },
  { name: "apple-mobile-web-app-title", content: SITE_NAME },
  { property: "og:type", content: "website" },
  { property: "og:site_name", content: SITE_NAME },
  { property: "og:locale", content: "en_US" },
  { property: "og:url", content: `${SITE_URL}/` },
  { property: "og:title", content: SITE_TITLE },
  { property: "og:description", content: SITE_DESCRIPTION },
  { property: "og:image", content: OG_IMAGE },
  { property: "og:image:secure_url", content: OG_IMAGE },
  { property: "og:image:type", content: "image/jpeg" },
  { property: "og:image:width", content: "1200" },
  { property: "og:image:height", content: "675" },
  { property: "og:image:alt", content: OG_IMAGE_ALT },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:site", content: "@paceui_" },
  { name: "twitter:title", content: SITE_TITLE },
  { name: "twitter:description", content: SITE_DESCRIPTION },
  { name: "twitter:image", content: OG_IMAGE },
  { name: "twitter:image:alt", content: OG_IMAGE_ALT },
]

export const seoLinks: NonNullable<AnyRouteMatch["links"]> = [
  { rel: "canonical", href: `${SITE_URL}/` },
  { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
  {
    rel: "icon",
    type: "image/png",
    sizes: "192x192",
    href: "/logo/icon-192.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "512x512",
    href: "/logo/icon-512.png",
  },
  { rel: "apple-touch-icon", href: "/logo/apple-touch-icon.png" },
  { rel: "manifest", href: "/manifest.json" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400..700&display=swap",
  },
]
