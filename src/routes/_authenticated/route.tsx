import { authUserQueryOptions } from '@/core/hooks/auth'
import { createFileRoute, redirect } from '@tanstack/react-router'
import type { User } from '@/core/types'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    const queryClient = context.queryClient
    const user: User | undefined = await queryClient
      .ensureQueryData(authUserQueryOptions)
      .catch(() => {
        return undefined
      })

    if (!user) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }

    if (!user.email_verified_at) {
      throw redirect({
        to: '/verify-email',
        search: {
          redirect: location.href,
        },
      })
    }
  },
})
