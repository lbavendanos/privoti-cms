'use client'

import type { Item } from '@/components/ui/sidebar-nav'
import { Suspense } from 'react'
import {
  Sidebar,
  SidebarRail,
  SidebarFooter,
  SidebarContent,
} from '@/components/ui/sidebar'
import { SidebarNav } from '@/components/ui/sidebar-nav'
import { AppSidebarHeader } from './app-sidebar-header'
import { UserMenu, UserMenuSkeleton } from '@/components/user-menu'
import {
  Tag,
  Home,
  Users,
  Settings,
  BarChart2,
  ShoppingCart,
} from 'lucide-react'

const PLATFORM_ITEMS: Item[] = [
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

const FOOTER_ITEMS: Item[] = [
  {
    title: 'Settings',
    url: '/settings/store',
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarNav label="Platform" items={PLATFORM_ITEMS} />
        <SidebarNav items={FOOTER_ITEMS} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <Suspense fallback={<UserMenuSkeleton />}>
          <UserMenu />
        </Suspense>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
