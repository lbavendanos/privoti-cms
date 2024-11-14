'use client'

import { useEffect, useState } from 'react'
import type { Item } from '../app-sidebar'
import { ChevronRight } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'

function NavMainItems({ item }: { item: Item }) {
  const [isActive, setIsActive] = useState(item.isActive)

  useEffect(() => {
    setIsActive(item.isActive)
  }, [item.isActive])

  return (
    <Collapsible
      asChild
      className="group/collapsible"
      open={isActive}
      defaultOpen={item.isActive}
      onOpenChange={(value) => setIsActive(value)}
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
}

function NavMainItem({ item }: { item: Item }) {
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
}

export function NavMain({ items }: { items: Item[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) =>
          item.items && item.items.length > 0 ? (
            <NavMainItems key={item.title} item={item} />
          ) : (
            <NavMainItem key={item.title} item={item} />
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
