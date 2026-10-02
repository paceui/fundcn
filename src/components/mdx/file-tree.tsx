import { useMemo } from "react"
import { ChevronRightIcon, FileCodeIcon, FolderIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

export type FileTreeEntry = {
  path: string
}

type TreeFile = { kind: "file"; name: string; path: string }
type TreeFolder = {
  kind: "folder"
  name: string
  path: string
  children: TreeNode[]
}
type TreeNode = TreeFile | TreeFolder

export type FileTreeProps = {
  files: FileTreeEntry[]
  selectedPath: string
  onSelectPath: (path: string) => void
  className?: string
}

const isFolder = (node: TreeNode): node is TreeFolder => node.kind === "folder"

const containsSelected = (folderPath: string, selectedPath: string) =>
  selectedPath.startsWith(`${folderPath}/`)

const sortNodes = (nodes: TreeNode[]): TreeNode[] =>
  [...nodes]
    .sort((a, b) => {
      if (isFolder(a) !== isFolder(b)) return isFolder(a) ? -1 : 1
      return a.name.localeCompare(b.name)
    })
    .map((node) =>
      isFolder(node) ? { ...node, children: sortNodes(node.children) } : node
    )

const getOrCreateFolder = (
  parent: TreeFolder,
  name: string,
  path: string
): TreeFolder => {
  const existing = parent.children.find(
    (node): node is TreeFolder => isFolder(node) && node.name === name
  )
  if (existing) return existing

  const folder: TreeFolder = { kind: "folder", name, path, children: [] }
  parent.children.push(folder)
  return folder
}

export const buildFileTree = (files: FileTreeEntry[]): TreeNode[] => {
  const root: TreeFolder = { kind: "folder", name: "", path: "", children: [] }

  for (const { path } of files) {
    const parts = path.split("/").filter(Boolean)
    let folder = root

    parts.forEach((name, index) => {
      const segmentPath = parts.slice(0, index + 1).join("/")
      const isFile = index === parts.length - 1

      if (isFile) {
        folder.children.push({ kind: "file", name, path })
        return
      }

      folder = getOrCreateFolder(folder, name, segmentPath)
    })
  }

  return sortNodes(root.children)
}

const TreeFolderItem = ({
  folder,
  selectedPath,
  onSelectPath,
}: {
  folder: TreeFolder
  selectedPath: string
  onSelectPath: (path: string) => void
}) => {
  const activeInBranch = containsSelected(folder.path, selectedPath)

  return (
    <Collapsible
      key={folder.path}
      defaultOpen={activeInBranch}
      className="group"
    >
      <CollapsibleTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-1.5 px-2 py-1 text-xs font-normal transition-none hover:bg-muted/80"
          >
            <ChevronRightIcon className="size-3.5 shrink-0 rotate-90 transition-transform duration-200 group-data-closed:rotate-0" />
            <FolderIcon className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{folder.name}</span>
          </Button>
        }
      />
      <CollapsibleContent className="ms-3.5 border-l border-border/60 ps-1.5">
        <div className="flex flex-col gap-0.5 pt-0.5">
          {folder.children.map((child) => (
            <TreeNodeItem
              key={child.path}
              node={child}
              selectedPath={selectedPath}
              onSelectPath={onSelectPath}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

const TreeFileItem = ({
  file,
  selectedPath,
  onSelectPath,
}: {
  file: TreeFile
  selectedPath: string
  onSelectPath: (path: string) => void
}) => {
  const isSelected = selectedPath === file.path

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "w-full justify-start gap-2 px-2 py-1 text-xs font-normal text-muted-foreground transition-colors",
        {
          "bg-accent font-medium text-accent-foreground": isSelected,
          "hover:bg-muted/70 hover:text-foreground": !isSelected,
        }
      )}
      onClick={() => onSelectPath(file.path)}
    >
      <FileCodeIcon
        className={cn(
          "size-3.5 shrink-0",
          isSelected ? "text-primary" : "text-muted-foreground"
        )}
      />
      <span className="truncate">{file.name}</span>
    </Button>
  )
}

const TreeNodeItem = ({
  node,
  selectedPath,
  onSelectPath,
}: {
  node: TreeNode
  selectedPath: string
  onSelectPath: (path: string) => void
}) =>
  isFolder(node) ? (
    <TreeFolderItem
      folder={node}
      selectedPath={selectedPath}
      onSelectPath={onSelectPath}
    />
  ) : (
    <TreeFileItem
      file={node}
      selectedPath={selectedPath}
      onSelectPath={onSelectPath}
    />
  )

export const FileTree = ({
  files,
  selectedPath,
  onSelectPath,
  className,
}: FileTreeProps) => {
  const nodes = useMemo(() => buildFileTree(files), [files])

  return (
    <div
      className={cn(
        "flex h-full w-full max-w-60 flex-col overflow-hidden border-e bg-muted/20",
        className
      )}
    >
      <div className="flex h-11 shrink-0 items-center justify-between border-b px-3 text-xs font-medium">
        <span className="tracking-wider text-muted-foreground uppercase">
          Explorer
        </span>
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          {files.length} {files.length === 1 ? "file" : "files"}
        </span>
      </div>
      <div className="custom-scrollbar flex-1 overflow-y-auto p-1.5">
        <div className="flex flex-col gap-0.5">
          {nodes.map((node) => (
            <TreeNodeItem
              key={node.path}
              node={node}
              selectedPath={selectedPath}
              onSelectPath={onSelectPath}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
