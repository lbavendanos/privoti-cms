import type { ApiError } from '@/lib/http'
import useSWR from 'swr'
import { useCallback, useMemo } from 'react'
import { api } from '@/lib/http'

export interface Admin {
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

export type AdminResponse = { admin?: Admin } & ApiError

export function useAdmin(
  config: Parameters<typeof useSWR<Admin | null>>[2] = {},
) {
  const { data, isLoading, mutate } = useSWR<Admin | null>(
    '/auth/admin',
    (url: string) =>
      api.get<{ data: Admin }>(url).then(({ data: response }) => response.data),
    config,
  )

  const admin = useMemo(() => data || null, [data])

  const setAdmin = useCallback(
    (admin?: Admin | null, revalidate: boolean = true) => {
      mutate(admin, { revalidate })
    },
    [mutate],
  )

  return {
    isLoading,
    admin,
    setAdmin,
  }
}
