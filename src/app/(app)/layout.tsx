import { getUser } from '@/core/actions/new/auth'
import { dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/query'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarTrigger,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { NavPath } from '@/components/nav-path'
import { AppSidebar } from './_components/app/app-sidebar'
import { HydrationBoundary } from '@tanstack/react-query'

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    queryKey: ['auth'],
    queryFn: () => getUser(),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <NavPath />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </HydrationBoundary>
  )
}
