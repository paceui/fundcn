import { PlusIcon } from "lucide-react"

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

function Mark({
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
      aria-label={sponsor.name || "Sponsor"}
      className={cn(
        "group flex h-full w-full flex-col items-center justify-center rounded-lg text-center outline-none focus-visible:ring-2 focus-visible:ring-ring",
        large ? "p-3" : "p-2"
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center overflow-hidden rounded-md bg-muted text-foreground",
          large ? "size-20 text-base" : "size-14 text-sm"
        )}
      >
        {sponsor.name ? (
          <span aria-hidden className="font-medium">
            {initials(sponsor.name)}
          </span>
        ) : (
          <PlusIcon aria-hidden className={large ? "size-6" : "size-4"} />
        )}
      </span>
    </a>
  )
}

function EmptySlots() {
  return (
    <ul className={tierGrid(4)}>
      {Array.from({ length: 4 }).map((_, index) => (
        <li key={index} className="min-w-0">
          <div className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-muted-foreground">
            <PlusIcon className="size-5" aria-hidden />
            <span className="sr-only">Empty sponsor slot</span>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function ShowcaseCards({ tiers = [] }: SponsorsProps) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-16">
      <header className="mb-6 text-center">
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
        tiers.map((tier) => (
          <section
            key={tier.title}
            className="rounded-2xl border border-border bg-card p-5 sm:p-6"
          >
            <h2 className="mb-4 text-sm font-medium tracking-[0.16em] uppercase">
              {tier.title}
            </h2>
            <ul className={tierGrid(tier.sponsors.length)}>
              {tier.sponsors.map((sponsor, sponsorIndex) => (
                <li
                  key={sponsor.url || `${tier.title}-${sponsorIndex}`}
                  className="min-w-0"
                >
                  <Mark
                    sponsor={sponsor}
                    large={tier.title === "Platinum"}
                    purchaseUrl={tier.purchaseUrl}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  )
}
