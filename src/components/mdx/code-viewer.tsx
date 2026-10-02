"use client"

import { useMemo, useState } from "react"
import {
  transformerNotationDiff,
  transformerNotationHighlight,
} from "@shikijs/transformers"
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"

import { cn } from "@/lib/utils"

import { CopyButton } from "./copy-button"

export type CodeViewerFile = {
  code?: string
  path: string
  lang?: string
}

export type CodeViewerProps = {
  files: CodeViewerFile[]
  className?: string
}

const refineCode = (code: string) => {
  return code.replace(/^\n|\n\s*$/g, "")
}

export const CodeViewer = ({ files = [], className }: CodeViewerProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectedFile = useMemo((): CodeViewerFile | undefined => {
    return files[selectedIndex]
  }, [selectedIndex, files])

  const selectedLang = useMemo(() => {
    return selectedFile?.lang ?? selectedFile?.path.split(".").at(-1) ?? "tsx"
  }, [selectedFile])

  const selectedCode = useMemo(() => {
    if (!selectedFile) return ""
    return refineCode(selectedFile.code ?? "")
  }, [selectedFile])

  return (
    <div
      className="not-typeset max-w-full rounded-md bg-muted in-[.typeset]:mt-4"
      data-slot="code-viewer"
    >
      <div className="flex items-center justify-between pe-2">
        <div className="flex items-center px-2 pt-2">
          {files?.map((file, index) => (
            <div
              className={cn(
                "cursor-pointer px-3 py-1.5 text-sm text-muted-foreground transition-all hover:text-foreground",
                {
                  "rounded-t-sm bg-background font-medium text-foreground shadow-sm":
                    selectedIndex === index,
                }
              )}
              key={index}
              onClick={() => setSelectedIndex(index)}
            >
              {`${file.path.split("/").at(-1)}`}
            </div>
          ))}
        </div>
        <CopyButton text={selectedCode} />
      </div>
      <div className={cn("relative mt-0 max-h-96 px-2 pb-2", className)}>
        <DynamicCodeBlock
          lang={selectedLang}
          code={selectedCode}
          codeblock={{
            className: cn(
              "max-h-80 rounded-sm border-none bg-background **:font-mono",
              {
                "rounded-tl-none": selectedIndex === 0,
              }
            ),
            viewportProps: {
              className: "max-h-80 custom-scrollbar",
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
