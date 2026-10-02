import { Suspense, lazy, useMemo, type ComponentType } from "react"

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

export const ComponentViewer = ({ path }: { path: string }) => {
  const DynamicComponent = useMemo(() => {
    const cleanPath = path.replace(/\.(tsx|jsx|ts|js)$/, "")
    const loader = componentMap[cleanPath] || componentMap[path]
    if (!loader) return null
    return lazy(loader)
  }, [path])

  if (!DynamicComponent) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Component not found: {path}
      </div>
    )
  }

  return (
    <Suspense fallback={<div className="h-40 w-80" />}>
      <DynamicComponent />
    </Suspense>
  )
}
