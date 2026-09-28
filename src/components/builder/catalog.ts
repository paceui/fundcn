import { ShowcaseCards } from "@/components/sponsor/showcase/cards"
import { ShowcaseStage } from "@/components/sponsor/showcase/stage"
import { ShowcaseWall } from "@/components/sponsor/showcase/wall"
import { PricingCards } from "@/components/sponsor/pricing/cards"
import { PricingCompare } from "@/components/sponsor/pricing/compare"

export const sponsorDesigns = [
  {
    id: "cards",
    label: "Cards",
    registry: "showcase-cards",
    component: "ShowcaseCards",
    path: "@/components/sponsor/showcase/cards",
    Component: ShowcaseCards,
  },
  {
    id: "wall",
    label: "Wall",
    registry: "showcase-wall",
    component: "ShowcaseWall",
    path: "@/components/sponsor/showcase/wall",
    Component: ShowcaseWall,
  },
  {
    id: "stage",
    label: "Stage",
    registry: "showcase-stage",
    component: "ShowcaseStage",
    path: "@/components/sponsor/showcase/stage",
    Component: ShowcaseStage,
  },
] as const

export const pricingLayouts = [
  {
    id: "cards",
    label: "Cards",
    registry: "pricing-cards",
    component: "PricingCards",
    path: "@/components/sponsor/pricing/cards",
    Component: PricingCards,
  },
  {
    id: "compare",
    label: "Compare",
    registry: "pricing-compare",
    component: "PricingCompare",
    path: "@/components/sponsor/pricing/compare",
    Component: PricingCompare,
  },
] as const

export type SponsorId = (typeof sponsorDesigns)[number]["id"]
export type PricingLayoutId = (typeof pricingLayouts)[number]["id"]

export function findSponsor(id: string) {
  return sponsorDesigns.find((item) => item.id === id) ?? sponsorDesigns[0]
}

export function findPricingLayout(id: string) {
  return pricingLayouts.find((item) => item.id === id) ?? pricingLayouts[0]
}
