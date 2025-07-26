import type { Item } from '../sidebar-nav'
import {
  Sidebar,
  SidebarRail,
  SidebarFooter,
  SidebarContent,
} from '@/components/ui/sidebar'
import { UserMenu } from '../user-menu'
import { SidebarNav } from '../sidebar-nav'
import { SettingsSidebarHeader } from './settings-sidebar-header'
import { ArrowLeft, Bell, Store, User, Users } from 'lucide-react'

const ACCOUNT_ITEMS: Item[] = [
  {
    title: 'Profile',
    url: '/settings/profile',
    icon: User,
  },
  {
    title: 'Notifications',
    url: '/settings/notifications',
    icon: Bell,
  },
]

const GENERAL_ITEMS: Item[] = [
  {
    title: 'Store',
    url: '/settings/store',
    icon: Store,
  },
  {
    title: 'Users',
    url: '/settings/users',
    icon: Users,
  },
]

const FOOTER_ITEMS: Item[] = [
  {
    title: 'Back to Home',
    url: '/',
    icon: ArrowLeft,
  },
]

export function SettingsSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SettingsSidebarHeader />
      <SidebarContent>
        <SidebarNav label="Account" items={ACCOUNT_ITEMS} />
        <SidebarNav label="General" items={GENERAL_ITEMS} />
        <SidebarNav items={FOOTER_ITEMS} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
