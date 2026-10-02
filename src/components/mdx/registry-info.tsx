import {
  type ReactElement,
  type ReactNode,
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useState,
  cloneElement,
} from "react"
import { XIcon } from "lucide-react"

import { type RegistryItemName, registryItems } from "@/lib/registry-data"
import { cn } from "@/lib/utils"

import { InstallDialog } from "@/components/shared/install-dialog"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Spinner } from "@/components/ui/spinner"

const CodePreview = lazy(() =>
  import("./code-preview").then((module) => ({ default: module.CodePreview }))
)

export type RegistryInfoProps = {
  name: RegistryItemName
  title?: string
  description?: string
  trigger?: ReactElement
  children?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

type RegistryCodeFile = {
  path: string
  content: string
}

const getRegistryData = (name: RegistryItemName) =>
  registryItems.find((b) => b.name === name)

type RegistryHeaderActionsProps = {
  name: RegistryItemName
}

const RegistryHeaderActions = ({ name }: RegistryHeaderActionsProps) => {
  return (
    <div className="mt-3">
      <p className="text-sm font-medium text-foreground/80">CLI</p>
      <div className="mt-1.5 flex items-center gap-2">
        <InstallDialog name={name} />
      </div>
    </div>
  )
}

const LoadingFilesView = () => {
  return (
    <div className="flex h-full min-h-96 flex-col items-center justify-center gap-3">
      <Spinner className="size-6 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Loading code...</p>
    </div>
  )
}

const EmptyFilesView = () => {
  return (
    <div className="flex h-full min-h-96 items-center justify-center">
      <p className="text-sm text-muted-foreground">No code files available</p>
    </div>
  )
}

type RegistryBodyContentProps = {
  isLoadingFiles: boolean
  files: RegistryCodeFile[] | null
}

const RegistryBodyContent = ({
  isLoadingFiles,
  files,
}: RegistryBodyContentProps) => {
  if (isLoadingFiles) {
    return <LoadingFilesView />
  }

  if (!files || files.length === 0) {
    return <EmptyFilesView />
  }

  return (
    <Suspense fallback={<LoadingFilesView />}>
      <CodePreview files={files} className="h-full" />
    </Suspense>
  )
}

export const RegistryInfo = ({
  name,
  title,
  description,
  trigger,
  children,
  open: customOpen,
  onOpenChange,
  className,
}: RegistryInfoProps) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const [files, setFiles] = useState<RegistryCodeFile[] | null>(null)
  const [isLoadingFiles, setIsLoadingFiles] = useState(false)

  const isControlled = customOpen !== undefined
  const isOpen = isControlled ? customOpen : internalOpen

  const setOpen = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
  }

  const data = useMemo(() => getRegistryData(name), [name])

  useEffect(() => {
    if (!isOpen || files) return

    setIsLoadingFiles(true)
    fetch(`/r/${name}.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load")
        return res.json()
      })
      .then((output) => {
        setFiles(output.files ?? [])
      })
      .catch(() => {
        setFiles([])
      })
      .finally(() => {
        setIsLoadingFiles(false)
      })
  }, [isOpen, files, name])

  const triggerElement = trigger ?? (children as ReactElement | undefined)
  const itemTitle = title ?? data?.title ?? name
  const itemDescription = description ?? data?.description

  const finalTrigger = triggerElement
    ? cloneElement(triggerElement as React.ReactElement<any>, {
        onClick: (e: React.MouseEvent) => {
          setOpen(true)
          ;(triggerElement as React.ReactElement<any>).props.onClick?.(e)
        },
      })
    : null

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      {finalTrigger}

      <SheetContent
        side="right"
        showCloseButton={false}
        className={cn(
          "h-full max-w-[90%] gap-0 border-e p-0 shadow-none sm:max-w-md",
          className
        )}
      >
        <SheetHeader className="flex flex-col border-b px-4 py-3.5">
          <div className="flex min-w-0 items-center justify-between gap-2.5">
            <SheetTitle className="truncate text-lg">{itemTitle}</SheetTitle>
            <SheetClose
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-8"
                  aria-label="Close"
                >
                  <XIcon className="size-4" />
                  <span className="sr-only">Close</span>
                </Button>
              }
            />
          </div>

          {itemDescription && (
            <SheetDescription>{itemDescription}</SheetDescription>
          )}

          <RegistryHeaderActions name={name} />
        </SheetHeader>

        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          <RegistryBodyContent isLoadingFiles={isLoadingFiles} files={files} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
