import {
  Link,
  Outlet,
  createFileRoute,
  useLocation,
} from "@tanstack/react-router"
import { BookOpenIcon, BoxesIcon, LayersIcon, LayoutGridIcon } from "lucide-react"

import { BuilderFooter } from "@/components/builder/footer"
import { BuilderTopbar } from "@/components/builder/topbar"
import { DocsToc } from "@/components/builder/docs-toc"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  registryCategories,
  registryItems,
  getRegistryItem,
} from "@/lib/registry-data"

export const Route = createFileRoute("/components")({
  component: ComponentsLayout,
})

const categoryIcons: Record<string, React.ElementType> = {
  showcase: LayoutGridIcon,
  pricing: LayersIcon,
}

function ComponentsLayout() {
  const location = useLocation()
  const currentPath = location.pathname

  // Find active component for mobile header display
  const activeParam = currentPath.replace(/^\/components\/?/, "")
  const currentItem = activeParam ? getRegistryItem(activeParam) : null

  return (
    <div className="min-h-svh bg-background text-foreground">
      <BuilderTopbar />

      <SidebarProvider className="bg-transparent">
        {/* Placeholder spacer so content flows to the right of fixed sidebar */}
        <div className="hidden w-64 shrink-0 md:block" aria-hidden="true" />

        <Sidebar
          collapsible="none"
          className="fixed top-16 bottom-0 left-0 z-30 hidden h-[calc(100vh-4rem)] w-64 flex-col bg-transparent md:flex"
        >
          <SidebarContent className="bg-transparent">
            {/* Overview link */}
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={
                      currentPath === "/components" ||
                      currentPath === "/components/"
                    }
                    render={<Link to="/components" />}
                  >
                    <BookOpenIcon />
                    <span>Introduction</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            {/* Category groups */}
            {registryCategories.map((cat) => {
              const items = registryItems.filter((i) => i.category === cat.id)
              const Icon = categoryIcons[cat.id] || BoxesIcon

              return (
                <SidebarGroup key={cat.id}>
                  <SidebarGroupLabel>
                    <Icon />
                    <span>{cat.title}</span>
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {items.map((item) => {
                        const itemPath = `/components/${item.name}`
                        const isActive = currentPath === itemPath

                        return (
                          <SidebarMenuItem key={item.name}>
                            <SidebarMenuButton
                              isActive={isActive}
                              render={
                                <Link
                                  to="/components/$name"
                                  params={{ name: item.name }}
                                />
                              }
                            >
                              <span>{item.title}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              )
            })}
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="min-w-0 flex-1 bg-transparent">
          {/* Mobile header with sidebar trigger */}
          <div className="sticky top-16 z-40 flex items-center gap-2 border-b bg-background/95 px-4 py-2.5 backdrop-blur md:hidden">
            <SidebarTrigger />
            <div className="flex items-center gap-2 text-sm">
              <span className="text-xs font-medium text-muted-foreground">
                Components
              </span>
              {currentItem && (
                <>
                  <span className="text-muted-foreground">/</span>
                  <span className="max-w-[200px] truncate font-semibold text-foreground">
                    {currentItem.title}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Content + TOC wrapper */}
          <div className="flex w-full">
            {/* Dynamic Page Content */}
            <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12 lg:py-10">
              <Outlet />
            </main>

            {/* Right-side Table of Contents */}
            <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 xl:block">
              <div className="h-full overflow-y-auto px-4 py-6">
                <DocsToc />
              </div>
            </aside>
          </div>

          <BuilderFooter />
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
