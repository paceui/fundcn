import { Link } from "@tanstack/react-router"
import { type ReactNode, useMemo, useState } from "react"
import { Code2Icon, InfoIcon, RotateCcwIcon } from "lucide-react"

import { type RegistryItemName, registryItems } from "@/lib/registry-data"
import { cn } from "@/lib/utils"

import { InstallDialog } from "@/components/shared/install-dialog"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { RegistryInfo2 as RegistryInfo } from "./registry-info-2"
import { RegistryPreview } from "./registry-preview"

export type RegistryItemProps = {
  name: RegistryItemName
  title?: string
  description?: string
  demoFiles?: string[]
  children?: ReactNode
  className?: string
  full?: boolean
  pad?: "none" | "sm" | "md" | "default"
  href?: string
  isComponent?: boolean
  hideHeader?: boolean
}

const getRegistryData = (name: RegistryItemName) =>
  registryItems.find((b) => b.name === name)

export const RegistryItem = ({
  name,
  title,
  description,
  full,
  className,
  demoFiles,
  pad = "default",
  href,
  hideHeader,
}: RegistryItemProps) => {
  const [key, setKey] = useState(0)

  const [showCode, setShowCode] = useState(false)
  const [isHoverCardOpen, setIsHoverCardOpen] = useState(false)

  const data = useMemo(() => getRegistryData(name), [name])

  if (!data)
    return (
      <p className="p-4 text-sm text-muted-foreground">Component not found</p>
    )

  const itemTitle = title ?? data.title
  const itemDescription = description ?? data.description

  return (
    <div
      className={cn(
        "not-prose not-typeset group/item flex h-full flex-col overflow-hidden rounded-md bg-muted/80 p-1 pt-0 transition-all hover:bg-muted",
        "[&:not(:where(.in-grid_>_*))+[data-component='registry-item']]:mt-8 lg:[&:not(:where(.in-grid_>_*))+[data-component='registry-item']]:mt-12 2xl:[&:not(:where(.in-grid_>_*))+[data-component='registry-item']]:mt-16",
        {
          "xl:col-span-2": full,
          "col-span-1": !full,
        }
      )}
      data-component="registry-item"
      data-registry-name={name}
    >
      {!hideHeader && (
        <div className="flex items-center justify-between px-3 py-2 pe-2">
          <div className="flex items-center gap-3">
            {href ? (
              <Link
                to={href}
                className="text-sm font-medium transition-all hover:opacity-80 sm:text-base lg:text-lg"
              >
                {itemTitle}
              </Link>
            ) : (
              <p className="text-sm font-medium sm:text-base lg:text-lg">
                {itemTitle}
              </p>
            )}
          </div>
          <div
            className={cn(
              "flex items-center gap-1 transition-all duration-300 sm:translate-x-5 sm:opacity-0",
              "group-hover/item:translate-x-0 group-hover/item:opacity-100",
              isHoverCardOpen && "sm:translate-x-0 sm:opacity-100"
            )}
          >
            <HoverCard onOpenChange={setIsHoverCardOpen}>
              <HoverCardTrigger
                delay={0}
                render={
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="group hover:border-border hover:bg-card"
                    aria-label="View Code"
                    onClick={() => setShowCode(true)}
                  >
                    <Code2Icon className="size-4.5" />
                  </Button>
                }
              />
              <RegistryInfo
                name={name}
                title={itemTitle}
                description={itemDescription}
                open={showCode}
                onOpenChange={setShowCode}
              />
              <HoverCardContent
                side="bottom"
                sideOffset={8}
                className="flex w-48 flex-col gap-0.5 rounded-md p-1 shadow-none"
              >
                <InstallDialog name={name} variant="menu-item" />
                <div
                  className="group/dropdown-menu-item relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setShowCode(true)}
                >
                  <InfoIcon className="size-4" />
                  <span>Code & Info</span>
                </div>
              </HoverCardContent>
            </HoverCard>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="group hover:border-border hover:bg-card"
                    aria-label="Reload Preview"
                    onClick={() => setKey((prev) => prev + 1)}
                  >
                    <RotateCcwIcon className="size-4 transition-all group-hover:-rotate-15 group-active:-rotate-30" />
                  </Button>
                }
              />
              <TooltipContent>Reload Preview</TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}

      <div
        className={cn(
          "flex flex-1 flex-col justify-center overflow-visible rounded-md bg-card",
          {
            "p-0 sm:p-1 lg:p-2 2xl:p-4": pad == "sm",
            "p-0 sm:p-4 md:p-8 lg:p-10 xl:p-8 2xl:p-16": pad == "default",
          }
        )}
      >
        <div
          className={cn("mx-auto w-full min-w-0 overflow-visible", className)}
        >
          <RegistryPreview
            name={name}
            demoFile={demoFiles?.[0]}
            refreshKey={key}
          />
        </div>
      </div>
    </div>
  )
}
