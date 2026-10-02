import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowRightIcon } from "lucide-react"

import { InstallationViewer } from "@/components/mdx/installation-viewer"

export const Route = createFileRoute("/components/")({
  component: ComponentsOverviewPage,
})

function ComponentsOverviewPage() {
  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Introduction
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          Re-usable funding and sponsorship components for React, built on top
          of <span className="font-semibold text-foreground">shadcn/ui</span>{" "}
          and{" "}
          <span className="font-semibold text-foreground">Tailwind CSS</span>.
        </p>
      </header>

      {/* Intro */}
      <section className="space-y-4 leading-relaxed text-muted-foreground">
        <p>
          Fundcn is an open-source collection of copy-paste funding and
          sponsorship components designed for developers, indie creators, and
          open-source maintainers.
        </p>
        <p>
          This is <strong className="text-foreground">not</strong> a component
          library. You do not install it as an npm dependency. Instead, pick the
          components you need, copy and paste the code directly into your
          project, or install them with the shadcn CLI. The code is 100% yours
          to own and customize.
        </p>
      </section>

      {/* Key Features */}
      <section id="features" className="space-y-4 border-t pt-6">
        <h2
          id="features"
          className="text-xl font-semibold tracking-tight text-foreground"
        >
          Key Features
        </h2>
        <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <li className="flex items-start gap-2.5">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold text-foreground">
                shadcn/ui Compatible
              </strong>{" "}
              — Built on Radix UI primitives and Tailwind CSS. Installs cleanly via
              the shadcn CLI directly into your project.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold text-foreground">
                100% Code Ownership
              </strong>{" "}
              — Components live directly in your repository. No black-box
              dependencies or restrictive styles.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold text-foreground">
                Themeable & Accessible
              </strong>{" "}
              — Fully inherits your project&apos;s CSS variables, color palette,
              and light/dark themes with semantic HTML.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold text-foreground">
                Showcase & Pricing
              </strong>{" "}
              — Backer tier stages, grid arrays, column spotlights, and tiered
              pricing/donation cards.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold text-foreground">
                Zero Platform Lock-in
              </strong>{" "}
              — Works with GitHub Sponsors, Polar, Stripe, Patreon, Open
              Collective, Buy Me a Coffee, or custom APIs.
            </span>
          </li>
        </ul>
      </section>

      {/* Quick Start */}
      <section id="quick-start" className="space-y-4 border-t pt-6">
        <h2
          id="quick-start"
          className="text-xl font-semibold tracking-tight text-foreground"
        >
          Quick Start
        </h2>
        <p className="text-sm text-muted-foreground">
          Install any component directly into your project using the shadcn CLI:
        </p>
        <InstallationViewer
          shadcn={true}
          command="https://fundcn.paceui.com/r/showcase-stage.json"
        />
      </section>

      {/* Next Steps */}
      <section id="next-steps" className="space-y-4 border-t pt-6">
        <h2
          id="next-steps"
          className="text-xl font-semibold tracking-tight text-foreground"
        >
          Next Steps
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            to="/components/$name"
            params={{ name: "showcase-stage" }}
            className="group flex flex-col justify-between rounded-xl border bg-card/50 p-5 transition-colors hover:border-foreground/30 hover:bg-muted/30"
          >
            <div className="space-y-1">
              <div className="font-semibold text-foreground group-hover:text-primary">
                Browse Components
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Explore all showcase layouts, backer walls, and tiered pricing
                cards.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary">
              <span>View components</span>
              <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          <Link
            to="/"
            className="group flex flex-col justify-between rounded-xl border bg-card/50 p-5 transition-colors hover:border-foreground/30 hover:bg-muted/30"
          >
            <div className="space-y-1">
              <div className="font-semibold text-foreground group-hover:text-primary">
                Interactive Builder
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Customize, configure tiers, and preview your sponsor page in
                real-time.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary">
              <span>Open builder</span>
              <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
