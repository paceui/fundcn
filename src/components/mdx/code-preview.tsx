import { useMemo, useState } from "react"
import {
  transformerNotationDiff,
  transformerNotationHighlight,
} from "@shikijs/transformers"
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"
import { InfoIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

import { CopyButton } from "./copy-button"

export type PreviewFile = {
  path: string
  content: string
  lang?: string
}

export type CodePreviewProps = {
  files: PreviewFile[]
  className?: string
}

const refineCode = (code: string) => code.replace(/^\n|\n\s*$/g, "")

export const CodePreview = ({ files = [], className }: CodePreviewProps) => {
  const [selectedPath, setSelectedPath] = useState(files[0]?.path ?? "")

  const filesByPath = useMemo(
    () => new Map(files.map((file) => [file.path, file])),
    [files]
  )

  const selectedFile = filesByPath.get(selectedPath) ?? files[0]

  const selectedFileName = useMemo(() => {
    if (!selectedFile) return ""
    return selectedFile.path.split("/").pop() ?? selectedFile.path
  }, [selectedFile])

  const selectedLang = useMemo(() => {
    if (!selectedFile) return "tsx"
    return selectedFile.lang ?? selectedFile.path.split(".").at(-1) ?? "tsx"
  }, [selectedFile])

  const selectedCode = useMemo(() => {
    if (!selectedFile) return ""
    return refineCode(selectedFile.content)
  }, [selectedFile])

  const lineCount = useMemo(() => {
    if (!selectedCode) return 0
    return selectedCode.split("\n").length
  }, [selectedCode])

  if (!selectedFile) {
    return (
      <div className="flex h-full min-h-60 items-center justify-center text-sm text-muted-foreground">
        No files available to preview
      </div>
    )
  }

  return (
    <div
      className={cn(
        "not-typeset relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-background",
        className
      )}
      data-slot="code-preview"
    >
      <div className="flex h-11 shrink-0 items-center justify-between border-b px-3">
        <div className="flex min-w-0 items-center gap-2">
          {files.length > 1 ? (
            <Select
              value={selectedPath}
              onValueChange={(val) => val && setSelectedPath(val as string)}
            >
              <SelectTrigger className="h-8 w-auto max-w-sm min-w-0 border-none bg-transparent px-2 text-sm font-medium shadow-none hover:bg-muted/60 focus-visible:ring-0 dark:bg-transparent dark:hover:bg-muted/60">
                <span className="max-w-56 truncate">{selectedFileName}</span>
              </SelectTrigger>
              <SelectContent align="start" className="max-h-72 min-w-48">
                <SelectGroup>
                  {files.map((file) => {
                    const fileName = file.path.split("/").pop() ?? file.path
                    return (
                      <SelectItem
                        key={file.path}
                        value={file.path}
                        className="text-sm"
                      >
                        {fileName}
                      </SelectItem>
                    )
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : (
            <div className="flex min-w-0 items-center px-2 py-1 text-sm font-medium">
              <span className="truncate">{selectedFileName}</span>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <Popover>
            <PopoverTrigger
              render={
                <Button variant="ghost" size="icon-sm" aria-label="File info">
                  <InfoIcon className="size-4" />
                </Button>
              }
            />
            <PopoverContent
              align="end"
              sideOffset={6}
              className="w-60 gap-2.5 p-2.5 text-xs"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                  Path
                </span>
                <span className="rounded bg-muted/60 px-2 py-1 font-mono text-[11px] break-all text-foreground select-all">
                  {selectedFile.path}
                </span>
              </div>
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-muted-foreground">Type</span>
                <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-foreground uppercase">
                  {selectedLang}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Lines</span>
                <span className="font-mono text-xs font-medium text-foreground">
                  {lineCount}
                </span>
              </div>
            </PopoverContent>
          </Popover>
          <CopyButton text={selectedCode} />
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden bg-background">
        <DynamicCodeBlock
          lang={selectedLang}
          code={selectedCode}
          codeblock={{
            className:
              "h-full w-full shadow-none! **:font-mono rounded-none border-none my-0 bg-transparent!",
            viewportProps: {
              className: "h-full custom-scrollbar p-4 ps-0",
            },
            allowCopy: false,
          }}
          options={{
            themes: {
              light: "github-light",
              dark: "github-dark",
            },
            transformers: [
              transformerNotationHighlight({ matchAlgorithm: "v3" }),
              transformerNotationDiff({ matchAlgorithm: "v3" }),
            ],
          }}
        />
      </div>
    </div>
  )
}
