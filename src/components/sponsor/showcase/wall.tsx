import { ArrowUpRightIcon, PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { Card } from "@/components/ui/card"

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

function Outline({
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
      className="group block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="h-full rounded-xl py-0">
        <span
          className={cn(
            "relative flex items-start",
            large ? "gap-4 p-5" : "gap-3 p-4"
          )}
        >
          <span
            className={cn(
              "flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-foreground",
              large ? "size-12 text-sm" : "size-10 text-xs"
            )}
          >
            {sponsor.name ? (
              <span aria-hidden className="font-medium">
                {initials(sponsor.name)}
              </span>
            ) : (
              <PlusIcon aria-hidden className="size-4" />
            )}
          </span>
          <span className="min-w-0 flex-1 pe-6">
            <span
              className={cn(
                "truncate font-medium",
                large ? "text-lg" : "text-sm"
              )}
            >
              {sponsor.name || "Sponsor"}
            </span>
            {sponsor.description ? (
              <span className="mt-1 line-clamp-2 block text-sm text-muted-foreground">
                {sponsor.description}
              </span>
            ) : null}
          </span>
          <ArrowUpRightIcon
            aria-hidden
            className={cn(
              "absolute shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100",
              large ? "top-5 right-5 size-4" : "top-4 right-4 size-3.5"
            )}
          />
        </span>
      </Card>
    </a>
  )
}

function EmptySlots() {
  return (
    <ul className={tierGrid(4)}>
      {Array.from({ length: 4 }).map((_, index) => (
        <li key={index} className="min-w-0">
          <div className="flex min-h-[68px] items-center justify-center rounded-xl border border-dashed p-4 text-muted-foreground">
            <PlusIcon className="size-5" aria-hidden />
            <span className="sr-only">Empty sponsor slot</span>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function ShowcaseWall({ tiers = [] }: SponsorsProps) {
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
        <div className="flex flex-col">
          {tiers.map((tier, index) => (
            <section
              key={tier.title}
              className={cn("py-12", index > 0 && "border-t border-border")}
            >
              <h2 className="mb-6 text-center text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                {tier.title}
              </h2>
              <ul className={tierGrid(tier.sponsors.length)}>
                {tier.sponsors.map((sponsor, sponsorIndex) => (
                  <li
                    key={sponsor.url || `${tier.title}-${sponsorIndex}`}
                    className="min-w-0"
                  >
                    <Outline
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
