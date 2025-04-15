'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import React from 'react'
import Link from 'next/link'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarMenu,
  SidebarGroup,
  SidebarMenuSub,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarMenuSubItem,
  SidebarGroupContent,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar'
import { ChevronRight, type LucideIcon } from 'lucide-react'

export type Item = {
  title: string
  url?: string
  icon?: LucideIcon
  items?: Item[]
  isActive?: boolean
}

function makeItems(items: Item[], pathname: string): Item[] {
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

const SidebarNavItems = React.memo(({ item }: { item: Item }) => {
  const [isOpen, setIsOpen] = useState(item.isActive)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="group/collapsible"
      asChild
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                {subItem.url && (
                  <SidebarMenuSubButton isActive={subItem.isActive} asChild>
                    <Link href={subItem.url}>
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                )}
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
})
SidebarNavItems.displayName = 'SidebarNavItems'

const SidebarNavItem = React.memo(({ item }: { item: Item }) => {
  return (
    <SidebarMenuItem>
      {item.url && (
        <SidebarMenuButton
          tooltip={item.title}
          isActive={item.isActive}
          asChild
        >
          <Link href={item.url}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  )
})
SidebarNavItem.displayName = 'SidebarNavItem'

type SidebarNavProps = React.ComponentProps<typeof SidebarGroup> & {
  label?: string
  items: Item[]
}

export function SidebarNav({
  label,
  items: itemsProp,
  ...props
}: SidebarNavProps) {
  const pathname = usePathname()
  const items = makeItems(itemsProp, pathname)

  return (
    <SidebarGroup {...props}>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) =>
            item.items && item.items.length > 0 ? (
              <SidebarNavItems key={item.title} item={item} />
            ) : (
              <SidebarNavItem key={item.title} item={item} />
            ),
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
