import { planCheckout } from "@/components/sponsor/constant"

export type DemoSponsor = {
  name: string
  description?: string
  url: string
}

export type DemoSponsorTier = {
  title: string
  sponsors: DemoSponsor[]
  purchaseUrl?: string
}

export const demoSponsorTiers: DemoSponsorTier[] = [
  {
    title: "Platinum",
    sponsors: [
      {
        name: "Northwind",
        url: "https://example.com/northwind",
        description: "Platform hosting for the project.",
      },
      {
        name: "Lumen Lab",
        url: "https://example.com/lumen",
        description: "Design systems and brand support.",
      },
    ],
  },
  {
    title: "Gold",
    sponsors: [
      {
        name: "Harbor Cloud",
        url: "https://example.com/harbor",
        description: "Infrastructure credits for builds and previews.",
      },
      {
        name: "Paperplane",
        url: "https://example.com/paperplane",
        description: "Email delivery for release notes.",
      },
      {
        name: "Northline",
        url: "https://example.com/northline",
        description: "Docs hosting.",
      },
    ],
  },
  {
    title: "Silver",
    sponsors: [
      {
        name: "Kindred",
        url: "https://example.com/kindred",
        description: "Community moderation.",
      },
      {
        name: "Sable Studio",
        url: "https://example.com/sable",
        description: "Illustration for the homepage.",
      },
      {
        name: "Orbit Press",
        url: "https://example.com/orbit",
        description: "Print and swag for meetups.",
      },
    ],
  },
  {
    title: "Bronze",
    sponsors: [
      {
        name: "Mina",
        url: "https://example.com/mina",
        description: "Individual backer.",
      },
      {
        name: "Cobalt",
        url: "https://example.com/cobalt",
        description: "Bug bounties for the release.",
      },
      {
        name: "Juniper",
        url: "https://example.com/juniper",
        description: "Translation for the docs.",
      },
      {
        name: "Ash",
        url: "https://example.com/ash",
        description: "Office hours for new contributors.",
      },
    ],
  },
]

function blankSponsors(count: number): DemoSponsor[] {
  return Array.from({ length: count }, () => ({
    name: "",
    url: "",
    description: "Every sponsor also take place in our heart",
  }))
}

export const emptySponsorTiers: DemoSponsorTier[] = demoSponsorTiers.map(
  (tier) => ({
    title: tier.title,
    sponsors: blankSponsors(tier.sponsors.length),
    purchaseUrl: planCheckout(tier.title.toLowerCase()),
  })
)
