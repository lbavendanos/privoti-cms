'use client'

import { usePathname } from 'next/navigation'
import React, { useMemo } from 'react'
import {
  BarChart2,
  Command,
  Home,
  Settings,
  ShoppingCart,
  Tag,
  User,
  type LucideIcon,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavMain } from './nav/nav-main'
import { NavSecondary } from './nav/nav-secondary'
import Link from 'next/link'

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
    icon: User,
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
    url: '/settings',
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
  const appName = process.env.NEXT_PUBLIC_APP_NAME as string
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
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{appName}</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={mainItems} />
        <NavSecondary items={secondaryItems} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>{footerChildren}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
