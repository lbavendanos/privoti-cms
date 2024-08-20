import type { ApiError } from '@/lib/http'
import useSWR from 'swr'
import { useCallback, useMemo } from 'react'
import { api } from '@/lib/http'

export interface User {
  id: number
  first_name: string
  last_name: string
  dob?: string
  phone?: string
  email: string
  email_verified_at?: string
  updated_at?: string
  created_at?: string
}

export type UserResponse = { user?: User } & ApiError

export function useUser(
  config: Parameters<typeof useSWR<User | null>>[2] = {},
) {
  const { data, isLoading, mutate } = useSWR<User | null>(
    '/auth/user',
    (url: string) =>
      api.get<{ data: User }>(url).then(({ data: response }) => response.data),
    config,
  )

  const user = useMemo(() => data || null, [data])

  const setUser = useCallback(
    (user?: User | null, revalidate: boolean = true) => {
      mutate(user, { revalidate })
    },
    [mutate],
  )

  return {
    isLoading,
    user,
    setUser,
  }
}
