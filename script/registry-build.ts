import * as path from "node:path"
import { rm } from "node:fs/promises"

import { generateRegistry } from "./generate-registry/core"
import type { GeneratedRegistry } from "./generate-registry/types"
import { registry, registryMeta } from "./registry"

const ROOT = path.resolve(import.meta.dirname, "..")
const OUT_DIR = path.join(ROOT, "public/r")

function startCase(name: string) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

async function main() {
  // Drop stale output so removed items don't linger.
  await rm(OUT_DIR, { recursive: true, force: true })

  const generatedRegistries: GeneratedRegistry[] = registry.map((item) => ({
    name: item.name,
    type: item.type ?? "registry:block",
    title: item.title ?? startCase(item.name),
    description: item.description,
    dependencies: item.dependencies as string[] | undefined,
    registryDependencies: item.registryDependencies as string[] | undefined,
    files: (item.files || []).map((file: any) => ({
      path: typeof file === "string" ? file : file.path,
      type:
        typeof file === "string" ? ("registry:component" as const) : file.type,
    })),
  }))

  generateRegistry(OUT_DIR, generatedRegistries)

  console.log(`\n✅ Registry built: ${generatedRegistries.length} items`)
  console.log(`   ${registryMeta.name} → public/r/`)
  for (const item of generatedRegistries) {
    console.log(`   r/${item.name}.json`)
  }
}

await main()
