export type RegistryItemData = {
  name: string
  type: string
  title: string
  description?: string
  category: "showcase" | "pricing"
  files: { path: string; props?: Record<string, unknown> }[]
  dependencies?: string[]
  registryDependencies?: string[]
}

export type RegistryItemName = RegistryItemData["name"]

export const registryItems: RegistryItemData[] = [
  {
    name: "showcase-cards",
    type: "registry:block",
    title: "Showcase Cards",
    description:
      "Sponsor list where each tier is a bordered section of mark tiles.",
    category: "showcase",
    files: [{ path: "components/sponsor/showcase/cards" }],
    dependencies: ["lucide-react", "motion"],
  },
  {
    name: "showcase-wall",
    type: "registry:block",
    title: "Showcase Wall",
    description:
      "Sponsor list with a hairline between tiers and an outline card for each sponsor.",
    category: "showcase",
    files: [{ path: "components/sponsor/showcase/wall" }],
    dependencies: ["lucide-react", "motion"],
    registryDependencies: ["card"],
  },
  {
    name: "showcase-stage",
    type: "registry:block",
    title: "Showcase Stage",
    description:
      "Sponsor list with a tier badge and a panel card for each sponsor.",
    category: "showcase",
    files: [{ path: "components/sponsor/showcase/stage" }],
    dependencies: ["lucide-react", "motion"],
  },
  {
    name: "pricing-cards",
    type: "registry:block",
    title: "Pricing Cards",
    description:
      "One price card for each sponsor tier with feature checkmarks and call to action.",
    category: "pricing",
    files: [{ path: "components/sponsor/pricing/cards" }],
    dependencies: ["lucide-react", "motion"],
    registryDependencies: ["button"],
  },
  {
    name: "pricing-compare",
    type: "registry:block",
    title: "Pricing Compare",
    description:
      "A comprehensive comparison table of sponsor tier prices, limits, and features.",
    category: "pricing",
    files: [{ path: "components/sponsor/pricing/compare" }],
    dependencies: ["lucide-react", "motion"],
    registryDependencies: ["button"],
  },
]

export const registryCategories = [
  {
    id: "showcase",
    title: "Showcase",
    description: "Sponsor showcase & listing components",
  },
  {
    id: "pricing",
    title: "Pricing",
    description: "Pricing & tier comparison components",
  },
] as const

export function getRegistryItem(name: string): RegistryItemData | undefined {
  return registryItems.find((item) => item.name === name)
}

export function getAdjacentItems(name: string) {
  const currentIndex = registryItems.findIndex((item) => item.name === name)
  if (currentIndex === -1) return { prev: null, next: null }
  const prev = currentIndex > 0 ? registryItems[currentIndex - 1] : null
  const next =
    currentIndex < registryItems.length - 1
      ? registryItems[currentIndex + 1]
      : null
  return { prev, next }
}
