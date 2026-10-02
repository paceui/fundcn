import { Suspense, lazy, useMemo, type ComponentType } from "react"

import { type RegistryItemName, registryItems } from "@/lib/registry-data"

import { demoSponsorTiers } from "@/components/builder/demo-sponsors"

// Statically map component paths to lazy imports
const componentMap: Record<
  string,
  () => Promise<{ default: ComponentType<any> }>
> = {
  "components/sponsor/showcase/cards": () =>
    import("@/components/sponsor/showcase/cards").then((m) => ({
      default: m.ShowcaseCards as ComponentType<any>,
    })),
  "components/sponsor/showcase/wall": () =>
    import("@/components/sponsor/showcase/wall").then((m) => ({
      default: m.ShowcaseWall as ComponentType<any>,
    })),
  "components/sponsor/showcase/stage": () =>
    import("@/components/sponsor/showcase/stage").then((m) => ({
      default: m.ShowcaseStage as ComponentType<any>,
    })),
  "components/sponsor/pricing/cards": () =>
    import("@/components/sponsor/pricing/cards").then((m) => ({
      default: m.PricingCards as ComponentType<any>,
    })),
  "components/sponsor/pricing/compare": () =>
    import("@/components/sponsor/pricing/compare").then((m) => ({
      default: m.PricingCompare as ComponentType<any>,
    })),
}

const getRegistryData = (name: RegistryItemName) =>
  registryItems.find((b) => b.name == name)

// Props to pass to each component for demo rendering
const getDemoProps = (name: string): Record<string, unknown> => {
  if (name.startsWith("showcase-")) {
    return { tiers: demoSponsorTiers }
  }
  return {}
}

export const RegistryPreview = ({
  name,
  demoFile,
  refreshKey,
}: {
  name?: RegistryItemName
  demoFile?: string
  refreshKey?: number
}) => {
  const data = name ? getRegistryData(name) : null
  const filePath = demoFile || (data?.files?.[0]?.path ?? null)

  const DynamicComponent = useMemo(() => {
    if (!filePath) return null
    const loader = componentMap[filePath]
    if (!loader) return null
    return lazy(loader)
  }, [filePath])

  if (!DynamicComponent) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Component not found: {filePath}
      </div>
    )
  }

  const demoProps = name ? getDemoProps(name) : {}

  return (
    <Suspense fallback={<div className="h-40 w-80" />}>
      <DynamicComponent key={refreshKey} {...demoProps} />
    </Suspense>
  )
}
