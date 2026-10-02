import type { ComponentProps } from "react"

import * as filesComponents from "fumadocs-ui/components/files"
import * as StepsComponents from "fumadocs-ui/components/steps"
import * as TabsComponents from "fumadocs-ui/components/tabs"
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock"
import defaultMdxComponents from "fumadocs-ui/mdx"

import { cn } from "@/lib/utils"

import { InstallDialog } from "@/components/shared/install-dialog"
import { Table } from "@/components/ui/table"

import { CodePreview } from "./code-preview"
import { CodeViewer } from "./code-viewer"
import { DemoPreview } from "./demo-preview"
import { FileTree } from "./file-tree"
import { InstallationViewer } from "./installation-viewer"
import { RegistryInfo2 as RegistryInfo } from "./registry-info-2"
import { RegistryItem } from "./registry-item"

export function getMDXComponents() {
  return {
    ...defaultMdxComponents,
    ...filesComponents,
    ...StepsComponents,
    ...TabsComponents,
    pre: ({ ...props }: ComponentProps<"pre">) => {
      return (
        <CodeBlock {...props}>
          <Pre>{props.children}</Pre>
        </CodeBlock>
      )
    },
    h1: (props: ComponentProps<"h1">) => <h1 {...props} />,
    h2: (props: ComponentProps<"h2">) => <h2 {...props} />,
    h3: (props: ComponentProps<"h3">) => <h3 {...props} />,
    table: ({ className, ...props }: ComponentProps<"table">) => (
      <div className="typeset-scroll my-6 w-full scroll-fade-x scrollbar-none overflow-x-auto rounded-md border bg-card/40 shadow-xs">
        <table
          className={cn(
            "w-full border-collapse border-b-0 text-left text-sm",
            className
          )}
          {...props}
        />
      </div>
    ),
    thead: ({ className, ...props }: ComponentProps<"thead">) => (
      <thead
        className={cn(
          "border-b bg-muted/60 font-medium text-muted-foreground",
          className
        )}
        {...props}
      />
    ),
    tbody: ({ className, ...props }: ComponentProps<"tbody">) => (
      <tbody
        className={cn(
          "divide-y divide-border/60 [&_tr:last-child]:border-b-0",
          className
        )}
        {...props}
      />
    ),
    tfoot: ({ className, ...props }: ComponentProps<"tfoot">) => (
      <tfoot
        className={cn("border-t bg-muted/40 font-medium", className)}
        {...props}
      />
    ),
    tr: ({ className, ...props }: ComponentProps<"tr">) => (
      <tr
        className={cn(
          "border-b transition-colors last:border-b-0 hover:bg-muted/30 data-[state=selected]:bg-muted",
          className
        )}
        {...props}
      />
    ),
    th: ({ className, ...props }: ComponentProps<"th">) => (
      <th
        className={cn(
          "h-10 px-4 py-3 text-start align-middle text-xs font-semibold tracking-wider whitespace-nowrap text-foreground uppercase [&[align=center]]:text-center [&[align=right]]:text-right",
          className
        )}
        {...props}
      />
    ),
    td: ({ className, ...props }: ComponentProps<"td">) => (
      <td
        className={cn(
          "px-4 py-3 align-middle text-sm text-foreground/90 [&_code]:rounded-md [&_code]:border [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&[align=center]]:text-center [&[align=right]]:text-right",
          className
        )}
        {...props}
      />
    ),
    Table,
    DemoPreview,
    InstallationViewer,
    CodeViewer,
    CodePreview,
    FileTree,
    RegistryInfo,
    RegistryItem,
    InstallDialog,
  }
}
