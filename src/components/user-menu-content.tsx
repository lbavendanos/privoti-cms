'use client'

import { logout } from '@/core/actions/new/auth'
import { useRouter } from 'next/navigation'
import { useSidebar } from '@/components/ui/sidebar'
import { useQueryClient } from '@tanstack/react-query'
import { startTransition, useCallback } from 'react'
import type { User } from '@/core/types'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { User as UserIcon, Bell, LogOut } from 'lucide-react'

export function UserMenuContent({ user }: { user: User }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { isMobile } = useSidebar()

  const handleLogout = useCallback(() => {
    startTransition(async () => {
      await logout()

      queryClient.clear()
      router.push('/login')
    })
  }, [router, queryClient])

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
          <Link href="/settings/profile">
            <UserIcon />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/settings/notifications">
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
