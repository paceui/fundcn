import { useState } from "react"
import {
  CheckIcon,
  ClipboardCheckIcon,
  CopyIcon,
  Settings2Icon,
  TerminalIcon,
} from "lucide-react"
import { useLocalStorage } from "usehooks-ts"

import type { RegistryItemName } from "@/lib/registry-data"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { frameworks, icons, packageManagers } from "./helpers"

export type PreferencesType = {
  packageManager: string
  framework: string
  iconLibrary: string
}

export type InstallDialogProps = {
  name: RegistryItemName | string
  variant?: "default" | "icon" | "menu-item"
  className?: string
}

export const InstallDialog = (props: InstallDialogProps) => {
  const [show, setShow] = useState(false)
  const { name, variant = "default" } = props
  const [copied, setCopied] = useState(false)
  const [iconCommandCopied, setIconCommandCopied] = useState(false)

  const [preferences, setPreferences] = useLocalStorage<PreferencesType>(
    "__fundcn_install_command_pref_v1__",
    {
      packageManager: "npm",
      framework: "tanstack",
      iconLibrary: "lucide",
    }
  )

  const updatePreferences = (newPrefs: Partial<PreferencesType>) => {
    setPreferences((prev) => ({ ...prev, ...newPrefs }))
  }

  const currentPm =
    packageManagers.find((pm) => pm.name === preferences.packageManager) ??
    packageManagers[0]
  const currentFramework =
    frameworks.find((fw) => fw.name === preferences.framework) ?? frameworks[0]
  const currentIcon =
    icons.find((ic) => ic.name === preferences.iconLibrary) ?? icons[0]

  const componentName = name ?? "component"
  const fullCommand = `${currentPm.fundcnInstall}${componentName}${currentFramework.fileSuffix}.json`
  const iconCommand = `${currentPm.execute}shadcn@latest migrate icons --to ${currentIcon.suffix}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleIconCopy = async () => {
    await navigator.clipboard.writeText(iconCommand)
    setIconCommandCopied(true)
    setTimeout(() => setIconCommandCopied(false), 2000)
  }

  if (variant === "menu-item") {
    return (
      <div
        className="group/dropdown-menu-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground"
        onClick={handleCopy}
      >
        {copied ? (
          <ClipboardCheckIcon className="size-4" />
        ) : (
          <TerminalIcon className="size-4" />
        )}
        <span>{copied ? "Copied!" : "Install command"}</span>
      </div>
    )
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            variant === "icon" ? (
              <Button
                size="icon-xs"
                variant="ghost"
                className="rounded-full text-muted-foreground hover:text-foreground"
                onClick={handleCopy}
                aria-label="Copy Install Command"
              >
                {copied ? (
                  <ClipboardCheckIcon className="size-4" />
                ) : (
                  <TerminalIcon className="size-4" />
                )}
              </Button>
            ) : (
              <div
                className="group relative flex h-9 max-w-44 min-w-17.5 cursor-pointer items-center gap-2 rounded-md border bg-card ps-1 pe-2 text-sm transition-all hover:bg-muted/40"
                onClick={handleCopy}
              >
                <Button
                  size="icon-xs"
                  variant="outline"
                  className="size-7"
                  aria-label="Copy Command"
                >
                  {copied ? (
                    <ClipboardCheckIcon className="size-4" />
                  ) : (
                    <TerminalIcon className="size-4" />
                  )}
                </Button>
                <p className="line-clamp-1 max-md:hidden">{fullCommand}</p>
                <Button
                  size="icon-xs"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShow(true)
                  }}
                  className="absolute inset-s-6 size-7 bg-card! opacity-0 shadow-none transition-all duration-300 group-hover:inset-s-9 group-hover:opacity-100 max-sm:inset-s-9 max-sm:opacity-100"
                  aria-label="Copy Install Command"
                >
                  <Settings2Icon className="size-4" />
                </Button>
              </div>
            )
          }
        />
        <TooltipContent>
          {variant === "icon" ? "Install Command" : "Copy Install Command"}
        </TooltipContent>
      </Tooltip>

      <Dialog open={show} onOpenChange={setShow}>
        <DialogContent
          showCloseButton={false}
          className="z-[60] flex max-h-[90dvh] min-w-xs flex-col gap-0 p-6 sm:min-w-sm md:min-w-2xl xl:min-w-xl"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-xl font-medium">
              <TerminalIcon className="size-4.5" />
              <span>Pick your setup</span>
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-sm text-muted-foreground">
              Choose your preferred package manager, framework, and icon library
              to generate the copy-paste installation command.
            </DialogDescription>
          </DialogHeader>
          <div className="custom-scrollbar mt-5 grow overflow-y-auto">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Package Manager</label>
                <Select
                  value={preferences.packageManager}
                  onValueChange={(val) =>
                    val && updatePreferences({ packageManager: val as string })
                  }
                >
                  <SelectTrigger className="w-full shadow-none">
                    <div className="flex items-center gap-2">
                      <img
                        src={currentPm.logo}
                        alt={currentPm.title}
                        className="size-4.5 object-contain"
                      />
                      <span>{currentPm.title}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {packageManagers.map((pm) => (
                      <SelectItem
                        key={pm.name}
                        value={pm.name}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={pm.logo}
                            alt={pm.title}
                            className="size-4.5 rounded-sm object-contain"
                          />
                          <span>{pm.title}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Framework</label>
                <Select
                  value={preferences.framework}
                  onValueChange={(val) =>
                    val && updatePreferences({ framework: val as string })
                  }
                >
                  <SelectTrigger className="w-full shadow-none">
                    <div className="flex items-center gap-2">
                      <img
                        src={currentFramework.logo}
                        alt={currentFramework.title}
                        className={cn("size-4.5 object-contain", {
                          "dark:invert": currentFramework.darkInvert,
                        })}
                      />
                      <span>{currentFramework.title}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {frameworks.map((fw) => (
                      <SelectItem
                        key={fw.name}
                        value={fw.name}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={fw.logo}
                            alt={fw.title}
                            className={cn("size-4.5 object-contain", {
                              "dark:invert": fw.darkInvert,
                            })}
                          />
                          <span>{fw.title}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Icon Library</label>
                <Select
                  value={preferences.iconLibrary}
                  onValueChange={(val) =>
                    val && updatePreferences({ iconLibrary: val as string })
                  }
                >
                  <SelectTrigger className="w-full shadow-none">
                    {currentIcon.title}
                  </SelectTrigger>
                  <SelectContent>
                    {icons.map((ic) => (
                      <SelectItem
                        className="cursor-pointer"
                        key={ic.name}
                        value={ic.name}
                      >
                        {ic.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-5">
              <p className="font-medium">Command</p>
              <div className="mt-1 flex items-center justify-between gap-2.5 rounded-md border bg-muted/30 py-1 ps-3 pe-1">
                <span className="line-clamp-1 text-foreground/90">
                  {fullCommand}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleCopy}
                  disabled={copied}
                >
                  {copied ? (
                    <CheckIcon className="size-4" />
                  ) : (
                    <CopyIcon className="size-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="mt-5">
              <p className="font-medium">
                Need to migrate icons, if you have other than Lucide
              </p>
              <div className="mt-1 flex items-center justify-between gap-2.5 rounded-md border bg-muted/30 py-1 ps-3 pe-1">
                <span className="line-clamp-1 text-foreground/90">
                  {iconCommand}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleIconCopy}
                  disabled={iconCommandCopied}
                >
                  {iconCommandCopied ? (
                    <CheckIcon className="size-4" />
                  ) : (
                    <CopyIcon className="size-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-end gap-2.5">
            <p className="text-sm text-muted-foreground">
              Settings save automatically
            </p>
            <DialogClose render={<Button variant="secondary">Close</Button>} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
