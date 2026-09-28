import { useTheme } from "@/hooks/theme-context"
import { presets } from "@/hooks/presets"
import { cn } from "@/lib/utils"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { PresetSwatch } from "@/components/builder/preset-swatch"

export function ThemeGenerator({ className }: { className?: string }) {
  const { preset, changePreset, selectedPreset, resolvedTheme } = useTheme()

  const fallbackTheme = resolvedTheme ?? "light"

  return (
    <Select
      value={preset}
      onValueChange={(value) => value && changePreset(value)}
    >
      <SelectTrigger
        aria-label="Theme preset"
        size="sm"
        className={cn("w-fit shadow-none ring-inset", className)}
      >
        <SelectValue>
          <span className="flex items-center gap-2">
            <PresetSwatch preset={selectedPreset} theme={fallbackTheme} />
            {selectedPreset.title}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent side="top" align="start" className="w-52 shadow-none">
        <SelectGroup>
          <SelectLabel>Theme</SelectLabel>
          {presets.map((item) => (
            <SelectItem key={item.name} value={item.name}>
              <span className="flex items-center gap-2">
                <PresetSwatch preset={item} theme={fallbackTheme} />
                {item.title}
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
