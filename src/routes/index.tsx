import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useRef, useState, type RefObject } from "react"

import {
  findPricingLayout,
  findSponsor,
  type PricingLayoutId,
  type SponsorId,
} from "@/components/builder/catalog"
import {
  demoSponsorTiers,
  emptySponsorTiers,
} from "@/components/builder/demo-sponsors"
import { BuilderFooter } from "@/components/builder/footer"
import { BuilderTopbar } from "@/components/builder/topbar"
import { PreviewToolbar } from "@/components/builder/toolbar"
import { SITE_TITLE, SITE_DESCRIPTION } from "@/lib/seo"

type BuilderChoice = {
  sponsorId: SponsorId
  pricingId: PricingLayoutId
}

const defaultChoice: BuilderChoice = {
  sponsorId: "stage",
  pricingId: "cards",
}

export const Route = createFileRoute("/")({ component: App })

function usePricingInView(ref: RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const update = () => {
      const rect = node.getBoundingClientRect()
      const next =
        rect.top < window.innerHeight * 0.6 &&
        rect.bottom > window.innerHeight * 0.2
      setInView((current) => (current === next ? current : next))
    }

    update()
    const frame = window.requestAnimationFrame(update)
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [ref])

  return inView
}

function App() {
  const pricingRef = useRef<HTMLDivElement>(null)
  const atPricing = usePricingInView(pricingRef)
  const [choice, setChoice] = useState<BuilderChoice>(defaultChoice)
  const [hasData, setHasData] = useState(false)
  const sponsor = findSponsor(choice.sponsorId)
  const pricing = findPricingLayout(choice.pricingId)
  const Sponsor = sponsor.Component
  const Pricing = pricing.Component

  return (
    <div className="min-h-svh bg-background">
      <BuilderTopbar />
      <main className="pb-28">
        <h1 className="sr-only">{SITE_TITLE}</h1>
        <h2 className="sr-only">{SITE_DESCRIPTION}</h2>
        <Sponsor tiers={hasData ? demoSponsorTiers : emptySponsorTiers} />
        <div ref={pricingRef}>
          <Pricing />
        </div>
        <BuilderFooter />
      </main>
      <PreviewToolbar
        sponsorId={sponsor.id}
        pricingId={pricing.id}
        atPricing={atPricing}
        hasData={hasData}
        onSponsorIdChange={(sponsorId) =>
          setChoice((current) => ({ ...current, sponsorId }))
        }
        onPricingIdChange={(pricingId) =>
          setChoice((current) => ({ ...current, pricingId }))
        }
        onHasDataChange={setHasData}
      />
    </div>
  )
}
