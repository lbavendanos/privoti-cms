'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Menu, Package2 } from 'lucide-react'
import { MenuItem } from './menu-item'
import Link from 'next/link'
import { MENU_ITEMS } from './menu-config'

export function MenuMobile() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME

  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetHeader className="text-center">
          <VisuallyHidden>
            <SheetTitle>{appName} menú</SheetTitle>
            <SheetDescription>
              Seleccione una opción para navegar en el sitio.
            </SheetDescription>
          </VisuallyHidden>
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
            onClick={() => setOpen(false)}
          >
            <Package2 className="h-6 w-6" />
            <span>{appName}</span>
          </Link>
        </SheetHeader>
        <nav className="grid gap-2 text-lg font-medium">
          {MENU_ITEMS.map((item) => (
            <MenuItem
              key={item.href}
              item={item}
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground"
              activeClassName="bg-muted text-foreground"
              inactiveClassName="text-muted-foreground"
              onClick={() => setOpen(false)}
            />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
