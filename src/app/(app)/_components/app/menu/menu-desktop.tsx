'use client'

import { MenuItem } from './menu-item'
import { MENU_ITEMS } from './menu-config'

export function MenuDesktop() {
  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {MENU_ITEMS.map((item) => (
        <MenuItem
          key={item.href}
          item={item}
          className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
          activeClassName="bg-muted text-primary"
          inactiveClassName="text-muted-foreground"
        />
      ))}
    </nav>
  )
}
