import { getUser } from '../actions/auth'
import { redirect } from 'next/navigation'
import { useSuspenseQuery } from '@tanstack/react-query'

export function useAuth() {
  const { data: user, isError } = useSuspenseQuery({
    queryKey: ['auth'],
    queryFn: () => getUser(),
    retry: false,
  })

  if (isError) {
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
