import { ArrowRightIcon, PlusIcon } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

export type Sponsor = {
  name: string
  description?: string
  url: string
}

export type Tier = {
  title: string
  sponsors: Sponsor[]
  purchaseUrl?: string
}

type SponsorsProps = {
  tiers?: Tier[]
}

const strongEase = [0.23, 1, 0.32, 1] as const

function tierGrid(count: number) {
  if (count <= 1) return "grid grid-cols-1 gap-4"
  if (count === 2) return "grid grid-cols-1 gap-4 sm:grid-cols-2"
  if (count === 3) return "grid grid-cols-1 gap-4 sm:grid-cols-3"
  return "grid grid-cols-2 gap-4 lg:grid-cols-4"
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean)
  return parts
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase()
}

function linkLabel(sponsor: Sponsor) {
  try {
    const url = new URL(sponsor.url)
    if (url.pathname.replace(/\/$/, "")) return sponsor.name
    return url.host.replace(/^www\./, "")
  } catch {
    return sponsor.name
  }
}

function Panel({
  sponsor,
  large = false,
  purchaseUrl,
}: {
  sponsor: Sponsor
  large?: boolean
  purchaseUrl?: string
}) {
  return (
    <a
      href={sponsor.url || purchaseUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={sponsor.name || "Sponsor"}
      className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card">
        <span
          className={cn(
            "flex flex-1 items-center justify-center bg-muted/40 transition-colors duration-200 group-hover:bg-muted/70",
            large ? "p-5" : "p-4"
          )}
        >
          <span
            className={cn(
              "flex items-center justify-center overflow-hidden rounded-md bg-background text-foreground",
              large ? "size-16 text-base" : "size-12 text-sm"
            )}
          >
            {sponsor.name ? (
              <span aria-hidden className="font-medium">
                {initials(sponsor.name)}
              </span>
            ) : (
              <PlusIcon aria-hidden className="size-5" />
            )}
          </span>
        </span>
        <span
          className={cn(
            "flex items-center justify-between gap-4 border-t",
            large ? "p-5 text-base" : "p-4 text-sm"
          )}
        >
          <span className="truncate">{linkLabel(sponsor) || "Sponsor"}</span>
          <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:opacity-100" />
        </span>
      </span>
    </a>
  )
}

function EmptySlots() {
  const shouldReduceMotion = useReducedMotion()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.06,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      transform: shouldReduceMotion ? "scale(1)" : "scale(0.96)",
    },
    visible: {
      opacity: 1,
      transform: "scale(1)",
      transition: { duration: 0.35, ease: strongEase },
    },
  }

  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={tierGrid(4)}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <motion.li key={index} variants={itemVariants} className="min-w-0">
          <div className="flex min-h-36 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-4 text-muted-foreground">
            <PlusIcon className="size-5" aria-hidden />
            <span className="sr-only">Empty sponsor slot</span>
          </div>
        </motion.li>
      ))}
    </motion.ul>
  )
}

export function ShowcaseStage({ tiers = [] }: SponsorsProps) {
  const shouldReduceMotion = useReducedMotion()

  const headerVariants = {
    hidden: {
      opacity: 0,
      transform: shouldReduceMotion ? "translateY(0px)" : "translateY(14px)",
    },
    visible: {
      opacity: 1,
      transform: "translateY(0px)",
      transition: {
        duration: 0.45,
        ease: strongEase,
      },
    },
  }

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      transform: shouldReduceMotion
        ? "translateY(0px) scale(1)"
        : "translateY(16px) scale(0.96)",
    },
    visible: {
      opacity: 1,
      transform: "translateY(0px) scale(1)",
      transition: {
        duration: 0.4,
        ease: strongEase,
      },
    },
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-16">
      <motion.header
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={headerVariants}
        className="mb-12 text-center"
      >
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
          Sponsors
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          Support open-source maintenance with a monthly sponsorship. Your logo
          and link will appear here.
        </p>
      </motion.header>
      {tiers.length === 0 ? (
        <EmptySlots />
      ) : (
        <div className="flex flex-col gap-10">
          {tiers.map((tier, index) => (
            <motion.section
              key={tier.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={sectionVariants}
            >
              <h2
                className={cn(
                  "mb-4 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium",
                  index === 0
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {tier.title}
              </h2>
              <motion.ul
                variants={sectionVariants}
                className={tierGrid(tier.sponsors.length)}
              >
                {tier.sponsors.map((sponsor, sponsorIndex) => (
                  <motion.li
                    key={sponsor.url || `${tier.title}-${sponsorIndex}`}
                    variants={itemVariants}
                    className="min-w-0"
                  >
                    <Panel
                      sponsor={sponsor}
                      large={tier.title === "Platinum"}
                      purchaseUrl={tier.purchaseUrl}
                    />
                  </motion.li>
                ))}
              </motion.ul>
            </motion.section>
          ))}
        </div>
      )}
    </div>
  )
}
