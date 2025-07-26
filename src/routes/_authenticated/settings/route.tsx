import { createFileRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
import { SettingsLayout } from '@/components/layouts/settings/settings-layout'

export const Route = createFileRoute('/_authenticated/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SettingsLayout>
      <Outlet />
    </SettingsLayout>
  )
}
