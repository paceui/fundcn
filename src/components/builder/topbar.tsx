import { useEffect, useState, lazy, Suspense } from "react"
import { ChevronDownIcon } from "lucide-react"
import { MorphIcon } from "morphicons/react"
import { Moon, Sun } from "lucide"

import { cn } from "@/lib/utils"
import { useTheme } from "@/hooks/theme-context"
import { PresetSwatch } from "@/components/builder/preset-swatch"
import { Button } from "@/components/ui/button"

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
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            aria-label="Toggle theme"
          >
            <MorphIcon icon={resolvedTheme === "dark" ? Sun : Moon} size={16} />
          </Button>
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
