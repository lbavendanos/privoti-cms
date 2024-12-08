'use client'

import { useEffect, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { ChevronRight, type LucideIcon } from 'lucide-react'

export type Item = {
  title: string
  url?: string
  icon?: LucideIcon
  items?: Item[]
  isActive?: boolean
}

function SidebarNavItems({ item }: { item: Item }) {
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

function SidebarNavItem({ item }: { item: Item }) {
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

interface SidebarNavProps
  extends React.ComponentPropsWithoutRef<typeof SidebarGroup> {
  label?: string
  items: Item[]
}

export function SidebarNav({ label, items, ...props }: SidebarNavProps) {
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
