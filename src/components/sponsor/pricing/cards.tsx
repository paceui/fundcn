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

export function PricingCards() {
  return (
    <section>
      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-16">
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
            Pricing
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Choose a monthly sponsorship tier that fits your budget. Each tier
            lists exactly what you get.
          </p>
        </header>
        <ul className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <li key={card.title} className="min-w-0">
              <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-5">
                <h3 className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  {card.title}
                </h3>
                <p className="mt-4 text-3xl font-medium tracking-tight tabular-nums">
                  {formatPrice(card.price)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  per {card.period}
                </p>
                <ul className="mt-5 grid gap-2 text-sm">
                  {card.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
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
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
