export type Plan = {
  slug: string
  purchaseUrl: string
}

export const plans: Plan[] = [
  { slug: "platinum", purchaseUrl: "https://example.com/sponsor/platinum" },
  { slug: "gold", purchaseUrl: "https://example.com/sponsor/gold" },
  { slug: "silver", purchaseUrl: "https://example.com/sponsor/silver" },
  { slug: "bronze", purchaseUrl: "https://example.com/sponsor/bronze" },
]

export function planCheckout(slug: string) {
  return plans.find((plan) => plan.slug === slug)?.purchaseUrl
}
