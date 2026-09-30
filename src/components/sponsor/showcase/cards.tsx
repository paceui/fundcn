import { PlusIcon } from "lucide-react"
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

function Mark({
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
      className={cn(
        "group flex h-full w-full flex-col items-center justify-center rounded-lg text-center outline-none focus-visible:ring-2 focus-visible:ring-ring",
        large ? "p-3" : "p-2"
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center overflow-hidden rounded-md bg-muted text-foreground transition-colors group-hover:bg-muted/80",
          large ? "size-20 text-base" : "size-14 text-sm"
        )}
      >
        {sponsor.name ? (
          <span aria-hidden className="font-medium">
            {initials(sponsor.name)}
          </span>
        ) : (
          <PlusIcon aria-hidden className={large ? "size-6" : "size-4"} />
        )}
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
          <div className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-muted-foreground">
            <PlusIcon className="size-5" aria-hidden />
            <span className="sr-only">Empty sponsor slot</span>
          </div>
        </motion.li>
      ))}
    </motion.ul>
  )
}

export function ShowcaseCards({ tiers = [] }: SponsorsProps) {
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
        : "translateY(14px) scale(0.96)",
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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-16">
      <motion.header
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={headerVariants}
        className="mb-6 text-center"
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
        tiers.map((tier) => (
          <motion.section
            key={tier.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={sectionVariants}
            className="rounded-2xl border border-border bg-card p-5 sm:p-6"
          >
            <h2 className="mb-4 text-sm font-medium tracking-[0.16em] uppercase">
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
                  <Mark
                    sponsor={sponsor}
                    large={tier.title === "Platinum"}
                    purchaseUrl={tier.purchaseUrl}
                  />
                </motion.li>
              ))}
            </motion.ul>
          </motion.section>
        ))
      )}
    </div>
  )
}
