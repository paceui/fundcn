import type { RegistryItem } from "shadcn/schema"

export type GeneratedRegistry = Pick<
  RegistryItem,
  | "name"
  | "title"
  | "description"
  | "registryDependencies"
  | "dependencies"
  | "type"
> & {
  files: (Pick<
    NonNullable<RegistryItem["files"]>[number],
    "path" | "type" | "target"
  > & {
    content?: string
  })[]
}

export type RegistryFile = GeneratedRegistry["files"][number]

export type RegistryRule = {
  pattern: RegExp
  replacement: string
  exclude?: RegExp
}

export type DependencyRule = RegistryRule

export type FrameworkName = "tanstack" | "react" | "next"

export type FrameworkPipeline = {
  name: FrameworkName
  refine: (registry: GeneratedRegistry) => GeneratedRegistry
}

export type ContentReplacement = {
  pattern: RegExp
  replacement: string
}
