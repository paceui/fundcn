import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"
import { useLocalStorage } from "usehooks-ts"

import { packageManagers } from "@/components/shared/install-dialog/helpers"
import { cn } from "@/lib/utils"

import { CopyButton } from "./copy-button"

export type InstallationViewerProps = {
  command: string
  registry?: boolean
  shadcn?: boolean
}

export const InstallationViewer = ({
  command,
  shadcn,
  registry,
}: InstallationViewerProps) => {
  const [selectedPm, setSelectedPm] = useLocalStorage<string>(
    "__fundcn_install_command_pm__",
    "npm"
  )

  const currentPm =
    packageManagers.find((pm) => pm.name === selectedPm) ?? packageManagers[0]

  const fullCommand = `${currentPm[registry ? "fundcnInstall" : shadcn ? "shadcn" : "packageInstall"]}${command}`

  return (
    <div className="not-typeset max-w-lg rounded-md bg-muted in-[.typeset]:mt-4">
      <div className="flex items-center justify-between pe-2">
        <div className="flex items-center px-2 pt-2">
          {packageManagers.map((manager, index) => (
            <div
              className={cn(
                "cursor-pointer px-3 py-1.5 text-sm text-muted-foreground lowercase transition-all hover:text-foreground",
                {
                  "rounded-t-sm bg-background font-medium text-foreground shadow-sm":
                    manager.name === selectedPm,
                }
              )}
              key={index}
              onClick={() => setSelectedPm(manager.name)}
            >
              {manager.title}
            </div>
          ))}
        </div>
        <CopyButton text={fullCommand} />
      </div>
      <div className="relative mt-0 max-h-96 px-2 pb-2">
        <DynamicCodeBlock
          lang="shell"
          code={fullCommand}
          codeblock={{
            className: cn("rounded-sm border-none bg-background **:font-mono", {
              "rounded-tl-none": selectedPm === packageManagers[0].name,
            }),
            allowCopy: false,
          }}
          options={{
            themes: {
              light: "github-light",
              dark: "github-dark",
            },
          }}
        />
      </div>
    </div>
  )
}
