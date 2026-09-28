import { type Preset } from "@/hooks/presets"

export function PresetSwatch({
  preset,
  theme,
}: {
  preset: Preset
  theme: "light" | "dark"
}) {
  return (
    <span className="relative size-4 shrink-0 overflow-hidden rounded-sm">
      <span className="absolute inset-s-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 rotate-45 flex-col gap-px">
        <span className="flex gap-px">
          <span
            className="size-5 bg-muted"
            style={{ backgroundColor: preset.styles[theme]?.["primary"] }}
          />
          <span
            className="size-5 bg-muted"
            style={{ backgroundColor: preset.styles[theme]?.["secondary"] }}
          />
        </span>
        <span className="flex gap-px">
          <span
            className="size-5 bg-muted"
            style={{ backgroundColor: preset.styles[theme]?.["destructive"] }}
          />
          <span
            className="size-5 bg-muted"
            style={{ backgroundColor: preset.styles[theme]?.["accent"] }}
          />
        </span>
      </span>
    </span>
  )
}
