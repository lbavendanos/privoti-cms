import type { Item } from '../sidebar-nav'
import {
  Sidebar,
  SidebarRail,
  SidebarFooter,
  SidebarContent,
} from '@/components/ui/sidebar'
import { UserMenu } from '../user-menu'
import { SidebarNav } from '../sidebar-nav'
import { AppSidebarHeader } from './app-sidebar-header'
import {
  Home,
  Tag,
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
        <UserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
