'use client'

import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Item, SidebarNav } from '@/components/ui/sidebar-nav'
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

export function SettingsSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SettingsSidebarHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav label="Account" items={ACCOUNT_ITEMS} />
        <SidebarNav label="General" items={GENERAL_ITEMS} />
        <SidebarNav items={FOOTER_ITEMS} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
