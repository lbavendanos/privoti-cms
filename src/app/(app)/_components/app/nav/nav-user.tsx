import { me } from '@/core/actions/auth'
import { ChevronsUpDown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { NavUserContent } from './nav-user-content'
import { Skeleton } from '@/components/ui/skeleton'

export async function NavUser() {
  const user = await me()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.full_name} />
                <AvatarFallback className="rounded-lg">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user.short_name}
                </span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <NavUserContent user={user} />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function NavUserSkeleton() {
  return (
    <div className="flex items-center space-x-2 p-1.5">
      <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
      <div className="flex w-full flex-col space-y-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  )
}
