import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { type RegistryItem } from "shadcn/schema"

import { registry, registryMeta } from "./registry.ts"

const ROOT = new URL("../", import.meta.url)
const OUT_DIR = new URL("public/r/", ROOT)

const ITEM_SCHEMA = "https://ui.shadcn.com/schema/registry-item.json"
const INDEX_SCHEMA = "https://ui.shadcn.com/schema/registry.json"

function startCase(name: string) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

/** `@components/...` install target for a repo-relative source path. */
function installTarget(sourcePath: string) {
  return "@" + sourcePath.replace(/^src\//, "")
}

async function buildItem(item: RegistryItem) {
  const contents = await Promise.all(
    (item.files || []).map(async (file: any) => {
      try {
        const path = typeof file === "string" ? file : file.path
        const type = typeof file === "string" ? "registry:component" : file.type
        return {
          path,
          type,
          content: await readFile(new URL(path, ROOT), "utf8"),
        }
      } catch {
        throw new Error(`Registry "${item.name}": file not found: ${file.path}`)
      }
    })
  )

  return {
    $schema: ITEM_SCHEMA,
    name: item.name,
    type: item.type,
    title: item.title ?? startCase(item.name),
    description: item.description,
    ...(item.dependencies ? { dependencies: item.dependencies } : {}),
    ...(item.registryDependencies
      ? { registryDependencies: item.registryDependencies }
      : {}),
    files: contents.map(
      ({
        path,
        content,
        type,
      }: {
        path: string
        content: string
        type: string
      }) => ({
        path,
        content,
        type,
        target: installTarget(path),
      })
    ),
  } as RegistryItem
}

async function main() {
  // Drop stale output so removed items don't linger.
  await rm(OUT_DIR, { recursive: true, force: true })
  await mkdir(OUT_DIR, { recursive: true })

  const built = await Promise.all(registry.map(buildItem))

  await Promise.all(
    built.map((item: RegistryItem) =>
      writeFile(
        new URL(`${item.name}.json`, OUT_DIR),
        JSON.stringify(item, null, 2) + "\n"
      )
    )
  )

  const index = {
    $schema: INDEX_SCHEMA,
    ...registryMeta,
    items: built.map(({ files, ...meta }: RegistryItem) => ({
      ...meta,
      files: (files || []).map(({ content, ...file }: any) => file),
    })),
  }
  await writeFile(
    new URL("registry.json", OUT_DIR),
    JSON.stringify(index, null, 2) + "\n"
  )

  for (const item of built) {
    console.log(`r/${item.name}.json (${item.files?.length ?? 0} files)`)
  }
  console.log(`r/registry.json (${built.length} items)`)
}

await main()
