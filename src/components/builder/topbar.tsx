import { useEffect, useState, lazy, Suspense } from "react"
import { ChevronDownIcon } from "lucide-react"
import { MorphIcon } from "morphicons/react"
import { Moon, Sun } from "lucide"

import { cn } from "@/lib/utils"
import { useTheme } from "@/hooks/theme-context"
import { PresetSwatch } from "@/components/builder/preset-swatch"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const ThemeGenerator = lazy(() =>
  import("@/components/builder/theme-generator").then((m) => ({
    default: m.ThemeGenerator,
  }))
)

function ThemeGeneratorSkeleton() {
  const { selectedPreset, resolvedTheme } = useTheme()
  const fallbackTheme = resolvedTheme ?? "light"

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-36 justify-between pr-2 pl-2.5 shadow-none"
      disabled
    >
      <span className="flex items-center gap-2">
        <PresetSwatch preset={selectedPreset} theme={fallbackTheme as any} />
        {selectedPreset.title}
      </span>
      <ChevronDownIcon className="size-4 text-muted-foreground opacity-50" />
    </Button>
  )
}

export function BuilderTopbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLElement &&
        (event.target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName))
      ) {
        return
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return

      if (event.key === "d" || event.key === "D") {
        event.preventDefault()
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [resolvedTheme, setTheme])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-dashed transition-all duration-200",
        isScrolled
          ? "border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2">
            <img
              src="/logo/icon-192.png"
              alt=""
              className="size-7 rounded-md"
            />
            <span className="text-xl font-bold text-foreground">Fundcn</span>
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Suspense fallback={<ThemeGeneratorSkeleton />}>
            <ThemeGenerator />
          </Suspense>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() =>
                    setTheme(resolvedTheme === "dark" ? "light" : "dark")
                  }
                  aria-label="Toggle theme (D)"
                >
                  <MorphIcon
                    icon={resolvedTheme === "dark" ? Sun : Moon}
                    size={16}
                  />
                </Button>
              }
            />
            <TooltipContent side="bottom" sideOffset={6}>
              <span className="flex items-center gap-1.5">
                <span>Toggle theme</span>
                <kbd className="rounded border border-background/25 bg-background/15 px-1 py-0.5 font-mono text-[10px] leading-none font-semibold">
                  D
                </kbd>
              </span>
            </TooltipContent>
          </Tooltip>
          <a
            href="https://x.com/withden_"
            target="_blank"
            rel="noreferrer"
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <img
              src="https://cdn.paceui.com/brand-logos/x.svg"
              alt="X (formerly Twitter)"
              className="size-4 dark:brightness-0 dark:invert"
            />
          </a>
          <a
            href="https://github.com/paceui/fundcn"
            target="_blank"
            rel="noreferrer"
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <img
              src="https://cdn.paceui.com/brand-logos/github.svg"
              alt="GitHub"
              className="size-4 dark:brightness-0 dark:invert"
            />
          </a>
        </div>
      </div>
    </header>
  )
}
