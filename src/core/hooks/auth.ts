import { fetcher } from '@/lib/utils'
import { redirect } from 'next/navigation'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { User } from '../types'

export function useAuth() {
  const {
    data: user,
    error,
    isFetching,
  } = useSuspenseQuery({
    queryKey: ['auth'],
    queryFn: () => fetcher<User>('/api/auth/user'),
  })

  if (error && !isFetching) {
    redirect('/login')
  }

  if (!user) {
    redirect('/login')
  }

  if (user.email_verified_at === null) {
    redirect('/verify-email')
  }

  return { user }
}
