import { createFileRoute, Link, notFound } from "@tanstack/react-router"
import { ArrowLeftIcon, ArrowRightIcon, PackageIcon } from "lucide-react"

import { RegistryItem } from "@/components/mdx/registry-item"
import { Button } from "@/components/ui/button"
import { getAdjacentItems, getRegistryItem } from "@/lib/registry-data"

export const Route = createFileRoute("/components/$name")({
  component: ComponentDocPage,
  loader: ({ params }) => {
    const item = getRegistryItem(params.name)
    if (!item) {
      throw notFound()
    }
    return { item }
  },
  notFoundComponent: ComponentNotFound,
})

function ComponentNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <PackageIcon className="size-7" />
      </div>
      <h1 className="mt-4 text-2xl font-bold">Component Not Found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The requested component does not exist in the Fundcn registry.
      </p>
      <div className="mt-6 flex gap-3">
        <Link to="/components">
          <Button variant="default">Browse All Components</Button>
        </Link>
        <Link to="/">
          <Button variant="outline">Back to Builder</Button>
        </Link>
      </div>
    </div>
  )
}

function ComponentDocPage() {
  const { name } = Route.useParams()
  const item = getRegistryItem(name)
  if (!item) {
    return <ComponentNotFound />
  }

  const { prev, next } = getAdjacentItems(name)

  return (
    <article className="space-y-10 pb-16">
      {/* Header & Meta */}
      <header id="overview" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {item.title}
            </h1>
            {item.description && (
              <p className="mt-2 text-base text-muted-foreground sm:text-lg">
                {item.description}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Main Interactive Preview with integrated Code & CLI options */}
      <section className="space-y-4">
        <h2
          id="preview"
          className="text-2xl font-bold tracking-tight text-foreground"
        >
          Preview
        </h2>
        <RegistryItem name={item.name} isComponent={true} />
      </section>

      {/* Prev / Next Pagination */}
      <nav className="flex items-center justify-between pt-8">
        {prev ? (
          <Link
            to="/components/$name"
            params={{ name: prev.name }}
            className="group flex max-w-[48%] flex-col items-start gap-1 rounded-lg border p-4 text-left transition-all hover:border-foreground/30 hover:bg-muted/50"
          >
            <span className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground">
              <ArrowLeftIcon className="size-3 transition-transform group-hover:-translate-x-0.5" />
              Previous
            </span>
            <span className="max-w-full truncate font-semibold text-foreground">
              {prev.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            to="/components/$name"
            params={{ name: next.name }}
            className="group ml-auto flex max-w-[48%] flex-col items-end gap-1 rounded-lg border p-4 text-right transition-all hover:border-foreground/30 hover:bg-muted/50"
          >
            <span className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground">
              Next
              <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
            </span>
            <span className="max-w-full truncate font-semibold text-foreground">
              {next.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  )
}
