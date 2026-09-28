export type ThemeTransitionEffect = "circular" | "slide"

export const THEME_TRANSITION_EFFECT: ThemeTransitionEffect = "slide"

export function performThemeTransition(
  applyTheme: () => void,
  effect: ThemeTransitionEffect = THEME_TRANSITION_EFFECT,
  originX?: number,
  originY?: number
) {
  if (!document.startViewTransition) {
    applyTheme()
    return
  }

  const transition = document.startViewTransition(applyTheme)

  transition.ready.then(() => {
    if (effect === "circular") {
      let x = originX
      let y = originY

      if (x === undefined || y === undefined) {
        const button = document.querySelector<HTMLElement>(
          "[data-theme-toggle], #theme-manager-btn, button[aria-label='Theme Manager']"
        )
        if (button) {
          const rect = button.getBoundingClientRect()
          x = rect.left + rect.width / 2
          y = rect.top + rect.height / 2
        } else {
          x = window.innerWidth / 2
          y = window.innerHeight / 2
        }
      }

      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    } else if (effect === "slide") {
      document.documentElement.animate(
        {
          clipPath: ["inset(0 0 100% 0)", "inset(0 0 0 0)"],
        },
        {
          duration: 600,
          easing: "cubic-bezier(0.34, 1.25, 0.64, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    }
  })
}
