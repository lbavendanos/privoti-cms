'use client'

import { useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { webUrl } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/core/auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CircleUser, Loader2 } from 'lucide-react'
import Link from 'next/link'

function UserLogout() {
  const { logout } = useAuth()
  const { toast } = useToast()

  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const handleLogout = useCallback(
    (e: Event) => {
      e.preventDefault()

      startTransition(async () => {
        const { error } = await logout()

        if (error) {
          toast({
            variant: 'destructive',
            description: error,
          })

          return
        }

        router.push('/login')
      })
    },
    [router, logout, toast],
  )

  return (
    <DropdownMenuItem
      className="cursor-pointer"
      aria-disabled={isPending}
      disabled={isPending}
      onSelect={handleLogout}
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Cerrar sesión
    </DropdownMenuItem>
  )
}

export function User() {
  const { user } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <CircleUser className="h-5 w-5" />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {user ? `${user.first_name} ${user.last_name}` : 'My Account'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/settings">Ajustes</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={webUrl().toString()}
            className="cursor-pointer"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ir a la tienda
          </Link>
        </DropdownMenuItem>
        <UserLogout />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
