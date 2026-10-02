import { type RegistryItem } from "shadcn/schema"

export const registryMeta = {
  name: "fundcn",
  homepage: "https://fundcn.paceui.com",
}

export const registry: RegistryItem[] = [
  {
    name: "showcase-cards",
    type: "registry:block",
    title: "Showcase Cards",
    description:
      "Sponsor list where each tier is a bordered section of mark tiles.",
    files: [
      {
        path: "src/components/sponsor/showcase/cards.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["lucide-react", "motion"],
  },
  {
    name: "showcase-wall",
    type: "registry:block",
    title: "Showcase Wall",
    description:
      "Sponsor list with a hairline between tiers and an outline card for each sponsor.",
    files: [
      {
        path: "src/components/sponsor/showcase/wall.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["lucide-react", "motion"],
    registryDependencies: ["card"],
  },
  {
    name: "showcase-stage",
    type: "registry:block",
    title: "Showcase Stage",
    description:
      "Sponsor list with a tier badge and a panel card for each sponsor.",
    files: [
      {
        path: "src/components/sponsor/showcase/stage.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["lucide-react", "motion"],
  },
  {
    name: "pricing-cards",
    type: "registry:block",
    title: "Pricing Cards",
    description: "One price card for each sponsor tier.",
    files: [
      {
        path: "src/components/sponsor/pricing/cards.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["lucide-react", "motion"],
    registryDependencies: ["button"],
  },
  {
    name: "pricing-compare",
    type: "registry:block",
    title: "Pricing Compare",
    description: "A comparison table of sponsor tier prices and features.",
    files: [
      {
        path: "src/components/sponsor/pricing/compare.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["lucide-react", "motion"],
    registryDependencies: ["button"],
  },
]
