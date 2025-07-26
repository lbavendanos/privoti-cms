import { authUserQueryOptions } from '@/core/hooks/auth'
import { createFileRoute, redirect } from '@tanstack/react-router'
import type { User } from '@/core/types'

export const Route = createFileRoute('/(auth)/_authenticated')({
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

    return { auth: { user } }
  },
})
