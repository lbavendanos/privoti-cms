'use client'

import type { MenuItem } from './menu-config'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface MenuItemProps extends React.ComponentProps<'a'> {
  item: MenuItem
  activeClassName: string
  inactiveClassName: string
}

export function MenuItem({
  item,
  activeClassName,
  inactiveClassName,
  className,
  ...props
}: MenuItemProps) {
  const pathname = usePathname()

  return (
    <Link
      key={item.href}
      href={item.href}
      className={cn(
        className,
        pathname === item.href
          ? activeClassName
          : item.href !== '/' && pathname.includes(item.href)
            ? activeClassName
            : inactiveClassName,
      )}
      {...props}
    >
      <item.icon className="h-4 w-4" />
      {item.title}
    </Link>
  )
}
