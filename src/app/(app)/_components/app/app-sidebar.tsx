'use client'

import { usePathname } from 'next/navigation'
import React, { useMemo } from 'react'
import {
  BarChart2,
  Home,
  Settings,
  ShoppingCart,
  Tag,
  Users,
  type LucideIcon,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar'
import { SidebarNav } from '@/components/ui/sidebar-nav'
import { AppSidebarHeader } from './app-sidebar-header'

export type Item = {
  title: string
  url?: string
  icon?: LucideIcon
  items?: Item[]
  isActive?: boolean
}

export const MAIN_ITEMS: Item[] = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Orders',
    url: '/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Products',
    icon: Tag,
    items: [
      { title: 'All Products', url: '/products' },
      { title: 'Inventory', url: '/inventory' },
      { title: 'Collections', url: '/collections' },
      { title: 'Categories', url: '/categories' },
    ],
  },
  {
    title: 'Customers',
    url: '/customers',
    icon: Users,
  },
  {
    title: 'Analytics',
    url: '/analytics',
    icon: BarChart2,
  },
]

const SECONDARY_ITEMS: Item[] = [
  {
    title: 'Settings',
    url: '/settings/store',
    icon: Settings,
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

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  footerChildren: React.ReactNode
}

export function AppSidebar({ footerChildren, ...props }: AppSidebarProps) {
  const pathname = usePathname()

  const mainItems = useMemo(
    () => generateItems(MAIN_ITEMS, pathname),
    [pathname],
  )

  const secondaryItems = useMemo(
    () => generateItems(SECONDARY_ITEMS, pathname),
    [pathname],
  )

  return (
    <Sidebar collapsible="icon" {...props}>
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarNav label="Platform" items={mainItems} />
        <SidebarNav items={secondaryItems} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>{footerChildren}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
