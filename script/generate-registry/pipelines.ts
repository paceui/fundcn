import type {
  ContentReplacement,
  FrameworkName,
  FrameworkPipeline,
} from "./types"

const CLIENT_HOOK_PATTERN = /\buse[A-Z][A-Za-z0-9]*\s*(?:<[^>\n]*>)?\s*\(/
const USE_CLIENT_DIRECTIVE_PATTERN = /^\s*["']use client["'];/

const addUseClientDirective = (content: string) => {
  if (
    !CLIENT_HOOK_PATTERN.test(content) ||
    USE_CLIENT_DIRECTIVE_PATTERN.test(content)
  ) {
    return content
  }

  return `"use client";\n\n${content}`
}

const createContentReplacementPipeline = (
  name: FrameworkName,
  replacements: ContentReplacement[],
  transformContent: (content: string) => string = (content) => content
): FrameworkPipeline => ({
  name,
  refine: (registry) => ({
    ...registry,
    files: registry.files.map((file) => {
      if (!file.content) return file

      const content = replacements.reduce(
        (result, replacement) =>
          result.replace(replacement.pattern, replacement.replacement),
        file.content
      )
      const transformedContent = transformContent(content)

      return transformedContent === file.content
        ? file
        : { ...file, content: transformedContent }
    }),
  }),
})

export const TANSTACK_PIPELINE = createContentReplacementPipeline("tanstack", [
  {
    pattern: /^\s*["']use client["'];\s*\n*/,
    replacement: "",
  },
])

export const FRAMEWORK_PIPELINES: FrameworkPipeline[] = [
  createContentReplacementPipeline("react", [
    {
      pattern:
        /import\s*{\s*Link\s*}\s*from\s*["']@tanstack\/react-router["'];?/g,
      replacement: 'import { Link } from "react-router-dom";',
    },
  ]),
  createContentReplacementPipeline(
    "next",
    [
      {
        pattern:
          /import\s*{\s*Link\s*}\s*from\s*["']@tanstack\/react-router["'];?/g,
        replacement: 'import Link from "next/link";',
      },
      {
        pattern: /<Link(\s[^>]*?)\bto=/g,
        replacement: "<Link$1href=",
      },
    ],
    addUseClientDirective
  ),
]
