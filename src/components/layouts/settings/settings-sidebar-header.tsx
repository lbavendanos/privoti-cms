import {
  SidebarMenu,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { Settings } from 'lucide-react'

export function SettingsSidebarHeader() {
  const appName = import.meta.env.VITE_APP_NAME

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <Link to="/settings/profile">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Settings className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{appName}</span>
                <span className="truncate text-xs">Settings</span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
}
