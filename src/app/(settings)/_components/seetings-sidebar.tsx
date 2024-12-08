'use client'

import { usePathname } from 'next/navigation'
import React, { useMemo } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { SidebarNav } from '@/components/ui/sidebar-nav'
import { SettingsSidebarHeader } from './settings-sidebar-header'
import { type LucideIcon, ArrowLeft, Bell, User } from 'lucide-react'

export type Item = {
  title: string
  url?: string
  icon?: LucideIcon
  items?: Item[]
  isActive?: boolean
}

export const MAIN_ITEMS: Item[] = [
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

const SECONDARY_ITEMS: Item[] = [
  {
    title: 'Back to Home',
    url: '/',
    icon: ArrowLeft,
  },
]

function generateItems(items: Item[], pathname: string): Item[] {
  return items.map((item) => {
    if (item.url === pathname) {
      return { ...item, isActive: true }
    }

    if (item.items) {
      const items = item.items.map((subItem) => {
        if (subItem.url === pathname) {
          return { ...subItem, isActive: true }
        }

        if (
          subItem.url &&
          subItem.url !== '/' &&
          pathname.includes(subItem.url)
        ) {
          return { ...subItem, isActive: true }
        }

        return subItem
      })

      const isActive = items.some((subItem) => subItem.isActive)

      return { ...item, items, isActive }
    }

    return item
  })
}

export function SettingsSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const mainItems = useMemo(
    () => generateItems(MAIN_ITEMS, pathname),
    [pathname],
  )

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SettingsSidebarHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav label="General" items={mainItems} />
        <SidebarNav items={SECONDARY_ITEMS} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
