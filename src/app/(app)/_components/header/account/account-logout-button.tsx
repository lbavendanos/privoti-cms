'use client'

import { useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/core/auth'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function AccountLogoutButton() {
  const { logout } = useAuth()
  const { toast } = useToast()

  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const handleLogout = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
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
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full"
      aria-disabled={isPending}
      disabled={isPending}
      onClick={handleLogout}
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Cerrar sesión
    </Button>
  )
}
