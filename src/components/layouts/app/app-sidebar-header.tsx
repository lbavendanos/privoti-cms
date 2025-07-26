import {
  SidebarMenu,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { GalleryVerticalEnd } from 'lucide-react'

export function AppSidebarHeader() {
  const appName = import.meta.env.VITE_APP_NAME

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <Link to="/">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{appName}</span>
                <span className="truncate text-xs">Dashboard</span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
}
