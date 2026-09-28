import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/button"

const cards = [
  {
    title: "Platinum",
    price: 79,
    period: "month",
    features: [
      "Homepage logo",
      "README link",
      "Release notes mention",
      "Largest logo placement",
    ],
    purchaseUrl: "https://example.com/sponsor/platinum",
  },
  {
    title: "Gold",
    price: 59,
    period: "month",
    features: ["Homepage logo", "README link", "Release notes mention"],
    purchaseUrl: "https://example.com/sponsor/gold",
  },
  {
    title: "Silver",
    price: 39,
    period: "month",
    features: ["Homepage logo", "README link"],
    purchaseUrl: "https://example.com/sponsor/silver",
  },
  {
    title: "Bronze",
    price: 19,
    period: "month",
    features: ["Homepage logo"],
    purchaseUrl: "https://example.com/sponsor/bronze",
  },
]

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount)
}

function featureRows() {
  const rows: string[] = []
  for (const card of cards) {
    for (const feature of card.features) {
      if (!rows.includes(feature)) rows.push(feature)
    }
  }
  return rows
}

export function PricingCompare() {
  const rows = featureRows()

  return (
    <section>
      <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col px-6 py-16">
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
            Pricing
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Choose a monthly sponsorship tier that fits your budget. Each tier
            lists exactly what you get.
          </p>
        </header>
        <div className="max-w-full min-w-0 overflow-x-auto rounded-2xl border border-border">
          <div
            role="table"
            aria-label="Pricing"
            className="w-full text-sm"
            style={{ minWidth: `${13 + cards.length * 12}rem` }}
          >
            <div role="row" className="flex">
              <div
                role="columnheader"
                className={cn(
                  "sticky left-0 z-10 w-52 shrink-0 border-r border-border bg-background",
                  rows.length > 0 && "border-b"
                )}
              />
              {cards.map((card, index) => (
                <div
                  key={card.title}
                  role="columnheader"
                  className={cn(
                    "flex min-w-48 flex-1 flex-col p-5 text-left",
                    rows.length > 0 && "border-b border-border",
                    index > 0 && "border-l",
                    index === 0 && "bg-muted/40"
                  )}
                >
                  <h3 className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-3xl font-medium tracking-tight whitespace-nowrap tabular-nums">
                    {formatPrice(card.price)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    per {card.period}
                  </p>
                  <div className="mt-auto pt-5">
                    <a
                      href={card.purchaseUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${card.title} sponsor`}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full"
                      )}
                    >
                      Sponsor
                    </a>
                  </div>
                </div>
              ))}
            </div>
            {rows.map((feature, rowIndex) => (
              <div key={feature} role="row" className="flex">
                <div
                  role="rowheader"
                  className={cn(
                    "sticky left-0 z-10 flex w-52 shrink-0 flex-col justify-center border-r border-border bg-background p-4 text-left font-normal whitespace-nowrap text-xs sm:text-sm",
                    rowIndex < rows.length - 1 && "border-b"
                  )}
                >
                  {feature}
                </div>
                {cards.map((card, index) => {
                  const included = card.features.includes(feature)
                  return (
                    <div
                      key={card.title}
                      role="cell"
                      className={cn(
                        "flex min-w-48 flex-1 flex-col items-center justify-center border-border p-4 text-center",
                        rowIndex < rows.length - 1 && "border-b",
                        index > 0 && "border-l",
                        index === 0 && "bg-muted/40"
                      )}
                    >
                      {included ? (
                        <>
                          <CheckIcon aria-hidden className="mx-auto size-3.5" />
                          <span className="inline-block h-0 w-0 overflow-hidden">
                            Included
                          </span>
                        </>
                      ) : (
                        <>
                          <span
                            aria-hidden
                            className="text-muted-foreground/50"
                          >
                            -
                          </span>
                          <span className="inline-block h-0 w-0 overflow-hidden">
                            Not included
                          </span>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
