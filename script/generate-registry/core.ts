import * as fs from "node:fs"
import * as path from "node:path"

import { FRAMEWORK_PIPELINES, TANSTACK_PIPELINE } from "./pipelines"
import type {
  DependencyRule,
  FrameworkName,
  FrameworkPipeline,
  GeneratedRegistry,
  RegistryFile,
  RegistryRule,
} from "./types"

const DEFAULT_REGISTRY_RULES: RegistryRule[] = [
  {
    pattern: /^(@\/)?components\/ui\/([^/]+)$/,
    replacement: "$2",
  },
]

const DEFAULT_DEPENDENCY_RULES: DependencyRule[] = [
  {
    pattern: /^motion(\/react)?(\/.*)?$/,
    replacement: "motion",
  },
]

const DEFAULT_IGNORED_IMPORTS: (string | RegExp)[] = [
  "@/lib/utils",
  /\/lib\/utils(\.ts|\.js|\.tsx|\.jsx)?$/,
]

const DEFAULT_IGNORED_DEPENDENCIES: (string | RegExp)[] = [
  "react",
  "react-dom",
  /^next(\/.*)?$/,
  /^node:.*/,
  "fs",
  "path",
  "url",
  "crypto",
  "http",
  "https",
  "events",
  "util",
]

const SOURCE_PATH = path.join(process.cwd(), "/src/")

const isIgnored = (val: string, rules: (string | RegExp)[]): boolean => {
  return rules.some((rule) => {
    if (typeof rule === "string") {
      const cleanRule = rule.replace(/^\.?\//, "")
      return val === rule || val.endsWith(cleanRule)
    }
    return rule.test(val)
  })
}

const getPackageName = (importPath: string): string => {
  if (importPath.startsWith("@")) {
    const parts = importPath.split("/")
    return parts.slice(0, 2).join("/")
  }
  return importPath.split("/")[0]
}

const resolveFilePath = (basePath: string): string | null => {
  const cleanPath = basePath.replace(
    /\.(ts|tsx|js|jsx|mjs|cjs|css|scss|less|json)$/,
    ""
  )
  const extensions = [
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
    ".css",
    ".scss",
    ".less",
    ".json",
  ]

  if (fs.existsSync(basePath) && fs.statSync(basePath).isFile())
    return path.resolve(basePath)
  if (fs.existsSync(cleanPath) && fs.statSync(cleanPath).isFile())
    return path.resolve(cleanPath)

  for (const ext of extensions) {
    const withExt = cleanPath + ext
    if (fs.existsSync(withExt) && fs.statSync(withExt).isFile())
      return path.resolve(withExt)
  }

  if (fs.existsSync(cleanPath) && fs.statSync(cleanPath).isDirectory()) {
    for (const ext of extensions) {
      const indexPath = path.join(cleanPath, `index${ext}`)
      if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile())
        return path.resolve(indexPath)
    }
  }

  return null
}

const resolveToAbsolute = (
  filePath: string,
  currentDir: string,
  sourceRoot: string
): string | null => {
  if (path.isAbsolute(filePath)) {
    return resolveFilePath(filePath)
  }

  if (filePath.startsWith(".") || filePath.startsWith("..")) {
    return resolveFilePath(path.join(currentDir, filePath))
  }

  const cleanImport = filePath.replace(/^[@~#$/]+\/?/, "").replace(/^src\//, "")

  const candidateRoots = [
    sourceRoot,
    path.join(process.cwd(), "src"),
    process.cwd(),
    currentDir,
  ]

  for (const root of candidateRoots) {
    const resolved = resolveFilePath(path.join(root, cleanImport))
    if (resolved) return resolved
  }

  for (const root of candidateRoots) {
    const resolved = resolveFilePath(path.join(root, filePath))
    if (resolved) return resolved
  }

  return null
}

const expandGlobFiles = (
  file: RegistryFile,
  sourceRoot: string
): RegistryFile[] => {
  if (!file.path.includes("**")) {
    return [file]
  }

  const baseDir = file.path.split("**")[0]
  const fullDirPath = path.join(sourceRoot, baseDir)

  if (!fs.existsSync(fullDirPath)) {
    return []
  }

  const allFiles = fs.readdirSync(fullDirPath, {
    recursive: true,
    withFileTypes: true,
  })
  const expandedFiles: RegistryFile[] = []

  for (const dirent of allFiles) {
    if (dirent.isFile()) {
      const fullPath = path.join(
        (dirent as fs.Dirent & { path?: string }).path || fullDirPath,
        dirent.name
      )
      const relativePath = path
        .relative(sourceRoot, fullPath)
        .replace(/\\/g, "/")

      expandedFiles.push({
        ...file,
        path: relativePath,
      })
    }
  }

  return expandedFiles
}

const resolveRegistryFilesAndDependencies = (
  initialFiles: RegistryFile[],
  sourceRoot: string,
  registryRules: RegistryRule[],
  dependencyRules: DependencyRule[],
  ignoredImports: (string | RegExp)[],
  ignoredDependencies: (string | RegExp)[],
  contentOverrides = new Map<string, string>()
): {
  resolvedFiles: RegistryFile[]
  detectedRegistryDeps: Set<string>
  detectedDependencies: Set<string>
} => {
  const fileMap = new Map<string, RegistryFile>()
  const detectedRegistryDeps = new Set<string>()
  const detectedDependencies = new Set<string>()
  const visitedPaths = new Set<string>()

  const processFile = (
    inputPath: string,
    defaultType: RegistryFile["type"] = "registry:component",
    target?: RegistryFile["target"]
  ) => {
    if (isIgnored(inputPath, ignoredImports)) return

    const currentContextDir = path.resolve(sourceRoot)
    const absolutePath = resolveToAbsolute(
      inputPath,
      currentContextDir,
      sourceRoot
    )

    if (!absolutePath || visitedPaths.has(absolutePath)) return
    visitedPaths.add(absolutePath)

    let normalizedRelativePath = path
      .relative(sourceRoot, absolutePath)
      .replace(/\\/g, "/")
    if (
      normalizedRelativePath.startsWith("../") ||
      normalizedRelativePath.startsWith("src/")
    ) {
      normalizedRelativePath = path
        .relative(process.cwd(), absolutePath)
        .replace(/\\/g, "/")
        .replace(/^src\//, "")
    }

    if (isIgnored(normalizedRelativePath, ignoredImports)) return

    const content =
      contentOverrides.get(normalizedRelativePath) ??
      fs.readFileSync(absolutePath, { encoding: "utf8" })

    fileMap.set(normalizedRelativePath, {
      path: normalizedRelativePath,
      type: defaultType,
      content,
      target: target || normalizedRelativePath,
    })

    const currentDir = path.dirname(absolutePath)
    const importMatches = Array.from(
      content.matchAll(/(?:from|import|require)\s*\(?\s*['"]([^'"]+)['"]/g)
    )

    for (const match of importMatches) {
      const importPath = match[1]
      if (isIgnored(importPath, ignoredImports)) continue

      let isRegistryDep = false

      for (const rule of registryRules) {
        if (rule.exclude && rule.exclude.test(importPath)) {
          continue
        }
        if (rule.pattern.test(importPath)) {
          const depName = importPath.replace(rule.pattern, rule.replacement)
          detectedRegistryDeps.add(depName)
          isRegistryDep = true
          break
        }
      }

      if (isRegistryDep) continue

      const localDiskPath = resolveToAbsolute(
        importPath,
        currentDir,
        sourceRoot
      )

      if (localDiskPath) {
        if (isIgnored(localDiskPath, ignoredImports)) continue

        const relPath = path
          .relative(sourceRoot, localDiskPath)
          .replace(/\\/g, "/")
        let type: RegistryFile["type"] = defaultType
        if (relPath.includes("/lib/") || relPath.includes("/utils/")) {
          type = "registry:lib"
        } else if (relPath.includes("/hooks/")) {
          type = "registry:hook"
        } else if (relPath.includes("/ui/")) {
          type = "registry:ui"
        }

        processFile(localDiskPath, type)
      } else {
        let pkgName: string | null = null

        for (const rule of dependencyRules) {
          if (rule.exclude && rule.exclude.test(importPath)) {
            continue
          }
          if (rule.pattern.test(importPath)) {
            pkgName = importPath.replace(rule.pattern, rule.replacement)
            break
          }
        }

        if (!pkgName) {
          pkgName = getPackageName(importPath)
        }

        if (
          !isIgnored(pkgName, ignoredDependencies) &&
          !isIgnored(importPath, ignoredDependencies)
        ) {
          detectedDependencies.add(pkgName)
        }
      }
    }
  }

  for (const file of initialFiles) {
    processFile(file.path, file.type, file.target)
  }

  return {
    resolvedFiles: Array.from(fileMap.values()),
    detectedRegistryDeps,
    detectedDependencies,
  }
}

const refineRegistry = (
  registry: GeneratedRegistry,
  sourceRoot: string,
  registryRules: RegistryRule[],
  dependencyRules: DependencyRule[],
  ignoredImports: (string | RegExp)[],
  ignoredDependencies: (string | RegExp)[],
  contentOverrides?: Map<string, string>
): GeneratedRegistry => {
  const expandedFiles = registry.files.flatMap((file) =>
    expandGlobFiles(file, sourceRoot)
  )
  const { resolvedFiles, detectedRegistryDeps, detectedDependencies } =
    resolveRegistryFilesAndDependencies(
      expandedFiles,
      sourceRoot,
      registryRules,
      dependencyRules,
      ignoredImports,
      ignoredDependencies,
      contentOverrides
    )

  return {
    ...registry,
    files: resolvedFiles,
    registryDependencies: Array.from(
      new Set([
        ...(registry.registryDependencies ?? []),
        ...detectedRegistryDeps,
      ])
    ),
    dependencies: Array.from(
      new Set([...(registry.dependencies ?? []), ...detectedDependencies])
    ),
  }
}

const refineFrameworkRegistry = (
  sourceRegistry: GeneratedRegistry,
  frameworkRegistry: GeneratedRegistry,
  sourceRoot: string,
  registryRules: RegistryRule[],
  dependencyRules: DependencyRule[],
  ignoredImports: (string | RegExp)[],
  ignoredDependencies: (string | RegExp)[]
): GeneratedRegistry => {
  const contentOverrides = new Map(
    frameworkRegistry.files.flatMap((file) =>
      file.content ? [[file.path, file.content] as const] : []
    )
  )

  return refineRegistry(
    {
      ...frameworkRegistry,
      dependencies: sourceRegistry.dependencies,
      registryDependencies: sourceRegistry.registryDependencies,
    },
    sourceRoot,
    registryRules,
    dependencyRules,
    ignoredImports,
    ignoredDependencies,
    contentOverrides
  )
}

const serializeRegistry = (registry: GeneratedRegistry): string =>
  JSON.stringify(registry, null, 2)

const getFrameworkRegistryPath = (
  outputDir: string,
  name: string,
  framework: FrameworkName
): string => {
  return path.join(outputDir, `${name}.${framework}.json`)
}

const writeRegistry = (filePath: string, registry: GeneratedRegistry): void => {
  fs.writeFileSync(filePath, serializeRegistry(registry), { encoding: "utf8" })
}

const removeFrameworkRegistry = (
  outputDir: string,
  name: string,
  framework: FrameworkName
): void => {
  const filePath = getFrameworkRegistryPath(outputDir, name, framework)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}

const generateFrameworkRegistries = (
  outputDir: string,
  baseRegistry: GeneratedRegistry,
  sourceRegistry: GeneratedRegistry,
  frameworkPipelines: FrameworkPipeline[],
  registryRules: RegistryRule[],
  dependencyRules: DependencyRule[],
  ignoredImports: (string | RegExp)[],
  ignoredDependencies: (string | RegExp)[]
): void => {
  const baseContent = serializeRegistry(baseRegistry)
  const pipelinesByFramework = new Map<FrameworkName, FrameworkPipeline[]>()

  for (const pipeline of frameworkPipelines) {
    const pipelines = pipelinesByFramework.get(pipeline.name) ?? []
    pipelines.push(pipeline)
    pipelinesByFramework.set(pipeline.name, pipelines)
  }

  for (const [framework, pipelines] of pipelinesByFramework) {
    const transformedRegistry = pipelines.reduce(
      (registry, pipeline) => pipeline.refine(registry),
      baseRegistry
    )
    const frameworkRegistry = refineFrameworkRegistry(
      sourceRegistry,
      transformedRegistry,
      SOURCE_PATH,
      registryRules,
      dependencyRules,
      ignoredImports,
      ignoredDependencies
    )

    if (serializeRegistry(frameworkRegistry) === baseContent) {
      removeFrameworkRegistry(outputDir, baseRegistry.name, framework)
      continue
    }

    writeRegistry(
      getFrameworkRegistryPath(outputDir, baseRegistry.name, framework),
      frameworkRegistry
    )
  }
}

export const generateRegistry = (
  outputDir: string,
  registries: GeneratedRegistry[]
) => {
  const refinedRegistries = registries.map((registry) => {
    const sourceRegistry = refineRegistry(
      registry,
      SOURCE_PATH,
      DEFAULT_REGISTRY_RULES,
      DEFAULT_DEPENDENCY_RULES,
      DEFAULT_IGNORED_IMPORTS,
      DEFAULT_IGNORED_DEPENDENCIES
    )

    return refineFrameworkRegistry(
      registry,
      TANSTACK_PIPELINE.refine(sourceRegistry),
      SOURCE_PATH,
      DEFAULT_REGISTRY_RULES,
      DEFAULT_DEPENDENCY_RULES,
      DEFAULT_IGNORED_IMPORTS,
      DEFAULT_IGNORED_DEPENDENCIES
    )
  })

  try {
    fs.mkdirSync(outputDir, { recursive: true })
  } catch (e) {
    console.error(e)
  }

  for (const [index, registry] of refinedRegistries.entries()) {
    writeRegistry(path.join(outputDir, `${registry.name}.json`), registry)
    generateFrameworkRegistries(
      outputDir,
      registry,
      registries[index],
      FRAMEWORK_PIPELINES,
      DEFAULT_REGISTRY_RULES,
      DEFAULT_DEPENDENCY_RULES,
      DEFAULT_IGNORED_IMPORTS,
      DEFAULT_IGNORED_DEPENDENCIES
    )
  }
}
