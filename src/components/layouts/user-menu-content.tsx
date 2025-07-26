import { useLogout } from '@/core/hooks/auth'
import { useSidebar } from '../ui/sidebar'
import { useNavigate } from '@tanstack/react-router'
import { useCallback } from 'react'
import type { User } from '@/core/types'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu'
import { Link } from '@tanstack/react-router'
import { Bell, LogOut, UserIcon } from 'lucide-react'

export function UserMenuContent({ user }: { user: User }) {
  const navigate = useNavigate()
  const { isMobile } = useSidebar()
  const { mutate } = useLogout()

  const handleLogout = useCallback(() => {
    mutate(undefined, {
      onSuccess: () => {
        navigate({ to: '/login' })
      },
    })
  }, [mutate, navigate])

  return (
    <DropdownMenuContent
      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
      side={isMobile ? 'bottom' : 'right'}
      align="end"
      sideOffset={4}
    >
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
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
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link to="/settings/profile">
            <UserIcon />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link to="/">
            <Bell />
            Notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="cursor-pointer" onSelect={handleLogout}>
        <LogOut />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
