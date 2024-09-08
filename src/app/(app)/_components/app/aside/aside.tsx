import { Button } from '@/components/ui/button'
import { Bell, Package2 } from 'lucide-react'
import Link from 'next/link'
import { MenuDesktop } from '../menu/menu-desktop'

export function Aside() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden border-r bg-white md:block md:w-56 lg:w-72">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">{appName}</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <MenuDesktop />
        </div>
      </div>
    </aside>
  )
}
