import { createFileRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
import { AppLayout } from '@/components/layouts/app/app-layout'

export const Route = createFileRoute('/_authenticated/(app)')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}
