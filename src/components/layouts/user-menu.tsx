import { useAuthUser } from '@/core/hooks/auth'
import { Skeleton } from '../ui/skeleton'
import { UserMenuContent } from './user-menu-content'
import { DropdownMenu, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import { ChevronsUpDown } from 'lucide-react'

export function UserMenu() {
  const { user } = useAuthUser()

  if (!user) {
    return <UserMenuSkeleton />
  }

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
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <UserMenuContent user={user} />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function UserMenuSkeleton() {
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
