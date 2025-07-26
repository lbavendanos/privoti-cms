import { core } from '@/lib/fetcher'
import {
  useQuery,
  useMutation,
  queryOptions,
  useQueryClient,
} from '@tanstack/react-query'
import type { User } from '../types'

export const AUTH_USER_QUERY_KEY = ['auth', 'user']

export const authUserQueryOptions = queryOptions({
  queryKey: AUTH_USER_QUERY_KEY,
  queryFn: () =>
    core.fetch<{ data: User }>('/api/c/auth/user').then((res) => res.data),
})

function csrf() {
  return core.fetch('/c/csrf-cookie')
}

export function useAuthUser() {
  const { data: user } = useQuery(authUserQueryOptions)

  return { user }
}

export function useUpdateAuthUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { name: string }) => {
      const { data: user } = await core.fetch<{ data: User }>(
        '/api/c/auth/user',
        {
          method: 'PUT',
          body: payload,
        },
      )

      return user
    },
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_USER_QUERY_KEY, user)
    },
  })
}

export function useUpdateAuthUserPassword() {
  return useMutation({
    mutationFn: (payload: { currentPassword: string; password: string }) =>
      core.fetch<{ data: User }>('/api/c/auth/user/password', {
        method: 'PUT',
        body: {
          current_password: payload.currentPassword,
          password: payload.password,
        },
      }),
  })
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      await csrf()

      const { data: user } = await core.fetch<{ data: User }>('/c/login', {
        method: 'POST',
        body: payload,
      })

      return user
    },
    onSuccess: (user) => {
      queryClient.clear()
      queryClient.setQueryData(AUTH_USER_QUERY_KEY, user)
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (payload: { email: string }) => {
      await csrf()

      return core.fetch('/c/forgot-password', {
        method: 'POST',
        body: payload,
      })
    },
  })
}

export function useResetPassword() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      token: string
      email: string
      password: string
      passwordConfirmation: string
    }) => {
      await csrf()

      const { data: user } = await core.fetch<{ data: User }>(
        '/c/reset-password',
        {
          method: 'POST',
          body: {
            token: payload.token,
            email: payload.email,
            password: payload.password,
            password_confirmation: payload.passwordConfirmation,
          },
        },
      )

      return user
    },
    onSuccess: (user) => {
      queryClient.clear()
      queryClient.setQueryData(AUTH_USER_QUERY_KEY, user)
    },
  })
}

export function useSendEmailVerificationNotification() {
  return useMutation({
    mutationFn: () =>
      core.fetch('/api/c/auth/user/email/notification', { method: 'POST' }),
  })
}

export function useSendEmailChangeVerificationNotification() {
  return useMutation({
    mutationFn: (payload: { email: string }) =>
      core.fetch('/api/c/auth/user/email/new/notification', {
        method: 'POST',
        body: payload,
      }),
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      core.fetch('/c/logout', {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.clear()
    },
  })
}
