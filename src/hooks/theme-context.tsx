import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react"

import { useTheme as useNextTheme } from "next-themes"

import { presets } from "@/hooks/presets"
import { applyStylesToDocument } from "@/lib/helpers/styles"


type CSSVariables = Record<string, string>
type PresetName = (typeof presets)[number]["name"]

type ThemeManagerData = {
  preset: PresetName
}

const defaultData: ThemeManagerData = {
  preset: "default",
}

const createShadowVariants = (baseValues: CSSVariables): CSSVariables => {
  if (!("shadow-x" in baseValues && "shadow-y" in baseValues)) {
    return {}
  }
  const {
    "shadow-x": x = "0",
    "shadow-y": y = "1px",
    "shadow-blur": blur = "3px",
    "shadow-spread": spread = "0px",
    "shadow-opacity": rawOpacity = "0.1",
  } = baseValues

  const opacity = parseFloat(rawOpacity)

  const createLayer = (
    yOffset: string,
    blurRadius: string,
    spreadRadius: string,
    alpha: number
  ): string =>
    `${x} ${yOffset} ${blurRadius} ${spreadRadius} hsl(0 0% 0% / ${alpha.toFixed(2)})`

  const baseLayer = createLayer(y, blur, spread, opacity)

  return {
    "shadow-2xs": createLayer(y, blur, spread, opacity * 0.5),
    "shadow-xs": createLayer(y, blur, spread, opacity * 0.5),
    "shadow-sm": `${baseLayer}, ${createLayer("1px", "2px", "-1px", opacity)}`,
    shadow: `${baseLayer}, ${createLayer("1px", "2px", "-1px", opacity)}`,
    "shadow-md": `${baseLayer}, ${createLayer("2px", "4px", "-1px", opacity)}`,
    "shadow-lg": `${baseLayer}, ${createLayer("4px", "6px", "-1px", opacity)}`,
    "shadow-xl": `${baseLayer}, ${createLayer("8px", "10px", "-1px", opacity)}`,
    "shadow-2xl": createLayer(y, blur, spread, opacity * 2.5),
  }
}

const useHook = () => {
  const { setTheme, theme, resolvedTheme } = useNextTheme()
  const [data, setData] = useState<ThemeManagerData>(defaultData)
  const [styles, setStyles] = useState<CSSVariables | null>(null)

  const updateData = (
    updater:
      | Partial<ThemeManagerData>
      | ((prev: ThemeManagerData) => Partial<ThemeManagerData>)
  ) => {
    setData((prev) => {
      const partial = typeof updater === "function" ? updater(prev) : updater
      return { ...prev, ...partial } as ThemeManagerData
    })
  }

  const changePreset = (preset: PresetName) => {
    updateData({ preset })
  }

  const reset = () => {
    setData(defaultData)
  }

  const selectedPreset =
    presets.find((item) => item.name === data.preset) ?? presets[0]

  useEffect(() => {
    const isFramed = window.self !== window.top
    if (!styles || isFramed) return
    const documentE = document.documentElement
    applyStylesToDocument(styles, documentE)
  }, [styles])

  useLayoutEffect(() => {
    const preset = presets.find((item) => item.name === data.preset)
    const activeTheme = resolvedTheme as "light" | "dark"
    const modeStyles = preset?.styles[activeTheme] ?? {}
    const shadowVariants = createShadowVariants(modeStyles)

    const styles: CSSVariables = {
      ...(preset?.styles?.theme ?? {}),
      ...modeStyles,
      ...shadowVariants,
    }

    const cssVariables: CSSVariables = {}
    Object.entries(styles).forEach(([key, value]) => {
      cssVariables[`--${key}`] = value
    })

    setStyles(cssVariables)
  }, [data.preset, resolvedTheme])

  useEffect(() => {
    const preset = presets.find((item) => item.name === data.preset)
    if (preset?.imports) {
      preset.imports.forEach((url) => {
        if (url && !document.querySelector(`link[href="${url}"]`)) {
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = url
          document.head.appendChild(link)
        }
      })
    }
  }, [data.preset])

  return {
    preset: data.preset,
    selectedPreset,
    changePreset,
    setTheme,
    theme,
    resolvedTheme: resolvedTheme as "light" | "dark",
    styles,
    reset,
  }
}

const ThemeContext = createContext({} as ReturnType<typeof useHook>)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return <ThemeContext value={useHook()}>{children}</ThemeContext>
}

export const useTheme = () => {
  return useContext(ThemeContext)
}
