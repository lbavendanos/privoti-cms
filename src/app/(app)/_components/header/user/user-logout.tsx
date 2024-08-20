'use client'

import { useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/core/auth'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Loader2 } from 'lucide-react'

export function UserLogout() {
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
      aria-disabled={isPending}
      disabled={isPending}
      onSelect={handleLogout}
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Cerrar sesión
    </DropdownMenuItem>
  )
}
