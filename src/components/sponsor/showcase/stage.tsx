import { ArrowRightIcon, PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type Sponsor = {
  name: string
  description?: string
  url: string
}

export type Tier = {
  title: string
  sponsors: Sponsor[]
  purchaseUrl?: string
}

type SponsorsProps = {
  tiers?: Tier[]
}

function tierGrid(count: number) {
  if (count <= 1) return "grid grid-cols-1 gap-4"
  if (count === 2) return "grid grid-cols-1 gap-4 sm:grid-cols-2"
  if (count === 3) return "grid grid-cols-1 gap-4 sm:grid-cols-3"
  return "grid grid-cols-2 gap-4 lg:grid-cols-4"
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean)
  return parts
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase()
}

function linkLabel(sponsor: Sponsor) {
  try {
    const url = new URL(sponsor.url)
    if (url.pathname.replace(/\/$/, "")) return sponsor.name
    return url.host.replace(/^www\./, "")
  } catch {
    return sponsor.name
  }
}

function Panel({
  sponsor,
  large = false,
  purchaseUrl,
}: {
  sponsor: Sponsor
  large?: boolean
  purchaseUrl?: string
}) {
  return (
    <a
      href={sponsor.url || purchaseUrl}
      target="_blank"
      rel="noreferrer"
      className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card">
        <span
          className={cn(
            "flex flex-1 items-center justify-center bg-muted/40 transition-colors group-hover:bg-muted/70",
            large ? "p-5" : "p-4"
          )}
        >
          <span
            className={cn(
              "flex items-center justify-center overflow-hidden rounded-md bg-background text-foreground",
              large ? "size-16 text-base" : "size-12 text-sm"
            )}
          >
            {sponsor.name ? (
              <span aria-hidden className="font-medium">
                {initials(sponsor.name)}
              </span>
            ) : (
              <PlusIcon aria-hidden className="size-5" />
            )}
          </span>
        </span>
        <span
          className={cn(
            "flex items-center justify-between gap-4 border-t",
            large ? "p-5 text-base" : "p-4 text-sm"
          )}
        >
          <span className="truncate">{linkLabel(sponsor) || "Sponsor"}</span>
          <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
        </span>
      </span>
    </a>
  )
}

function EmptySlots() {
  return (
    <ul className={tierGrid(4)}>
      {Array.from({ length: 4 }).map((_, index) => (
        <li key={index} className="min-w-0">
          <div className="flex min-h-36 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-4 text-muted-foreground">
            <PlusIcon className="size-5" aria-hidden />
            <span className="sr-only">Empty sponsor slot</span>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function ShowcaseStage({ tiers = [] }: SponsorsProps) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-16">
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
          Sponsors
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          Support open-source maintenance with a monthly sponsorship. Your logo
          and link will appear here.
        </p>
      </header>
      {tiers.length === 0 ? (
        <EmptySlots />
      ) : (
        <div className="flex flex-col gap-10">
          {tiers.map((tier, index) => (
            <section key={tier.title}>
              <h2
                className={cn(
                  "mb-4 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium",
                  index === 0
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {tier.title}
              </h2>
              <ul className={tierGrid(tier.sponsors.length)}>
                {tier.sponsors.map((sponsor, sponsorIndex) => (
                  <li
                    key={sponsor.url || `${tier.title}-${sponsorIndex}`}
                    className="min-w-0"
                  >
                    <Panel
                      sponsor={sponsor}
                      large={tier.title === "Platinum"}
                      purchaseUrl={tier.purchaseUrl}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
