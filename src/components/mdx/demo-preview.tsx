import { cn } from "@/lib/utils"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { CodeViewer } from "./code-viewer"
import { ComponentViewer } from "./component-viewer"
import { InstallationViewer } from "./installation-viewer"

type Props = {
  name?: string
  demoPath?: string
  filePaths?: string[]
  full?: boolean
  installationCommand?: string
}

export const DemoPreview = ({
  demoPath,
  filePaths = [],
  full = false,
  installationCommand,
}: Props) => {
  const files = [demoPath, ...filePaths]
    .filter((p): p is string => Boolean(p))
    .map((path) => ({ path }))

  return (
    <Tabs defaultValue="preview" className="not-typeset gap-4">
      <TabsList>
        {demoPath && <TabsTrigger value="preview">Preview</TabsTrigger>}
        <TabsTrigger value="code">Code</TabsTrigger>
        {installationCommand && (
          <TabsTrigger value="install">Install</TabsTrigger>
        )}
      </TabsList>
      {demoPath && (
        <TabsContent value="preview" className="h-full">
          <div
            className={cn(
              "not-prose relative flex items-center justify-center rounded-2xl bg-muted/40 sm:p-2 md:p-3 dark:bg-muted/20",
              full ? "w-full" : "p-0 sm:p-4 md:p-6 lg:p-8 xl:p-16"
            )}
          >
            <ComponentViewer path={demoPath} />
          </div>
        </TabsContent>
      )}
      <TabsContent value="code" className="py-0">
        <CodeViewer files={files} />
      </TabsContent>
      {installationCommand && (
        <TabsContent value="install">
          <InstallationViewer command={installationCommand} />
        </TabsContent>
      )}
    </Tabs>
  )
}
