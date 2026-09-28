import {
  findPricingLayout,
  findSponsor,
  type PricingLayoutId,
  type SponsorId,
} from "@/components/builder/catalog"

export function installCommand(
  origin: string,
  sponsorId: SponsorId,
  pricingId: PricingLayoutId
) {
  const sponsor = findSponsor(sponsorId)
  const pricing = findPricingLayout(pricingId)
  const urls = [sponsor.registry, pricing.registry].map(
    (name) => `${origin}/r/${name}`
  )
  return `npx shadcn@latest add ${urls.join(" ")}`
}

export function pageSource(sponsorId: SponsorId, pricingId: PricingLayoutId) {
  const sponsor = findSponsor(sponsorId)
  const pricing = findPricingLayout(pricingId)
  return `import { ${sponsor.component} } from "${sponsor.path}"
import { ${pricing.component} } from "${pricing.path}"

export function SponsorsPage() {
  return (
    <>
      <${sponsor.component} />
      <${pricing.component} />
    </>
  )
}
`
}
