import type { User, UserResponse } from './user'
import { useCallback, useMemo } from 'react'
import { useAdmin } from './admin'
import { api } from '@/lib/http'

export function useAuth() {
  const {
    admin: user,
    setAdmin: setUser,
    updateAdmin: updateUser,
    ...rest
  } = useAdmin({
    shouldRetryOnError: false,
    onError: () => {
      setUser(null, false)
    },
  })

  const check = useMemo(() => !!user, [user])

  const csrf = useCallback(() => api.get('/auth/csrf-cookie'), [])

  const login = useCallback(
    async (data: {
      email: string
      password: string
      remember: boolean
    }): Promise<UserResponse> => {
      await csrf()

      try {
        const {
          data: { data: user },
        } = await api.post<{ data: User }>('/auth/login', data)

        setUser(user)

        return { user }
      } catch (error: any) {
        return api.handleError(error)
      }
    },
    [csrf, setUser],
  )

  const logout = useCallback(async (): Promise<UserResponse> => {
    try {
      await api.post('/auth/logout')

      setUser(null)

      return {}
    } catch (error: any) {
      return api.handleError(error)
    }
  }, [setUser])

  return {
    user,
    updateUser,
    check,
    login,
    logout,
    ...rest,
  }
}
