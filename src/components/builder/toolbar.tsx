import { Toolbar } from "@base-ui/react/toolbar"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { CodeDialog } from "@/components/builder/code-dialog"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  pricingLayouts,
  sponsorDesigns,
  type PricingLayoutId,
  type SponsorId,
} from "@/components/builder/catalog"

type ToolbarProps = {
  sponsorId: SponsorId
  pricingId: PricingLayoutId
  atPricing: boolean
  hasData: boolean
  onSponsorIdChange: (id: SponsorId) => void
  onPricingIdChange: (id: PricingLayoutId) => void
  onHasDataChange: (value: boolean) => void
}

function isSponsorId(value: string): value is SponsorId {
  return sponsorDesigns.some((item) => item.id === value)
}

function isPricingLayoutId(value: string): value is PricingLayoutId {
  return pricingLayouts.some((item) => item.id === value)
}

function SwapPanel({
  shown,
  exitTranslate,
  children,
}: {
  shown: boolean
  exitTranslate: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "grid min-w-0 transition-[grid-template-columns] duration-300 ease-out motion-reduce:transition-none",
        shown ? "grid-cols-[1fr]" : "grid-cols-[0fr]"
      )}
      inert={!shown}
    >
      <div
        className={cn(
          "min-w-0 overflow-hidden",
          !shown && "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "me-px flex w-max items-center gap-1 transition-all ease-out motion-reduce:transition-none",
            shown
              ? "translate-y-0 opacity-100 delay-150 duration-300"
              : cn(exitTranslate, "opacity-0 duration-200")
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export function PreviewToolbar({
  sponsorId,
  pricingId,
  atPricing,
  hasData,
  onSponsorIdChange,
  onPricingIdChange,
  onHasDataChange,
}: ToolbarProps) {
  const sponsorLabel = sponsorDesigns.find(
    (item) => item.id === sponsorId
  )?.label
  const pricingLabel = pricingLayouts.find(
    (item) => item.id === pricingId
  )?.label

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <Toolbar.Root
        aria-label="Preview controls"
        className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-1 rounded-md border bg-popover/90 p-1.5 backdrop-blur-xl"
      >
        <div className="flex min-w-0 items-center">
          <SwapPanel shown={!atPricing} exitTranslate="-translate-y-3">
            <Select
              value={sponsorId}
              onValueChange={(value) => {
                if (value && isSponsorId(value)) onSponsorIdChange(value)
              }}
            >
              <SelectTrigger
                aria-label="Sponsor design"
                size="sm"
                className="w-fit shadow-none ring-inset"
              >
                <span className="text-muted-foreground">Sponsor</span>
                <SelectValue>{sponsorLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent side="top" align="start">
                {sponsorDesigns.map((design) => (
                  <SelectItem key={design.id} value={design.id}>
                    {design.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={hasData ? "fill" : "empty"}
              onValueChange={(value) => {
                if (value === "fill") onHasDataChange(true)
                else if (value === "empty") onHasDataChange(false)
              }}
            >
              <SelectTrigger
                aria-label="Sponsor data"
                size="sm"
                className="w-fit shadow-none ring-inset"
              >
                <span className="text-muted-foreground">Data</span>
                <SelectValue>{hasData ? "Fill" : "Empty"}</SelectValue>
              </SelectTrigger>
              <SelectContent side="top" align="start">
                <SelectItem value="fill">Fill</SelectItem>
                <SelectItem value="empty">Empty</SelectItem>
              </SelectContent>
            </Select>
          </SwapPanel>
          <SwapPanel shown={atPricing} exitTranslate="translate-y-3">
            <Select
              value={pricingId}
              onValueChange={(value) => {
                if (value && isPricingLayoutId(value)) onPricingIdChange(value)
              }}
            >
              <SelectTrigger
                aria-label="Pricing layout"
                size="sm"
                className="w-fit shadow-none ring-inset"
              >
                <span className="text-muted-foreground">Pricing</span>
                <SelectValue>{pricingLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent side="top" align="start">
                {pricingLayouts.map((layout) => (
                  <SelectItem key={layout.id} value={layout.id}>
                    {layout.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SwapPanel>
        </div>
        <Separator orientation="vertical" className="mx-1" />
        <CodeDialog sponsorId={sponsorId} pricingId={pricingId} />
      </Toolbar.Root>
    </div>
  )
}
