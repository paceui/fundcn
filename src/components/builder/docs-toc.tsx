import { useEffect, useState, useCallback } from "react"
import { ListIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface TocItem {
  id: string
  text: string
  level: number
}

export function DocsToc() {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  // Scan the main content for headings with IDs
  const scanHeadings = useCallback(() => {
    const main = document.querySelector("main")
    if (!main) return

    const headings = main.querySelectorAll("h2[id], h3[id]")
    const tocItems: TocItem[] = []

    headings.forEach((heading) => {
      const id = heading.getAttribute("id")
      const text = heading.textContent?.trim()
      if (id && text) {
        tocItems.push({
          id,
          text,
          level: heading.tagName === "H3" ? 3 : 2,
        })
      }
    })

    setItems(tocItems)
  }, [])

  // Scan on mount and when the URL changes
  useEffect(() => {
    // Small delay to let the page content render
    const timer = setTimeout(scanHeadings, 100)
    return () => clearTimeout(timer)
  }, [scanHeadings])

  // Re-scan on DOM mutations within main (for dynamic content)
  useEffect(() => {
    const main = document.querySelector("main")
    if (!main) return

    const observer = new MutationObserver(() => {
      scanHeadings()
    })

    observer.observe(main, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [scanHeadings])

  // IntersectionObserver for active heading tracking
  useEffect(() => {
    if (items.length === 0) return

    const headingElements = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[]

    if (headingElements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first entry that is intersecting (topmost visible heading)
        const visibleEntries = entries.filter((e) => e.isIntersecting)
        if (visibleEntries.length > 0) {
          // Pick the one closest to the top
          const sorted = visibleEntries.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )
          setActiveId(sorted[0].target.id)
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      }
    )

    headingElements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <nav className="flex flex-col gap-2" aria-label="Table of contents">
      <div className="flex items-center gap-2 px-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        <ListIcon className="size-3.5" />
        <span>On This Page</span>
      </div>
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault()
                const el = document.getElementById(item.id)
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" })
                  setActiveId(item.id)
                  // Update URL hash without jumping
                  window.history.replaceState(null, "", `#${item.id}`)
                }
              }}
              className={cn(
                "block rounded-md px-2 py-1 text-[13px] leading-snug transition-colors",
                item.level === 3 && "pl-4",
                activeId === item.id
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
