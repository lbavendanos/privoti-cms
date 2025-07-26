import { z } from 'zod'
import { core, isFetchError } from '@/lib/fetcher'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { AUTH_USER_QUERY_KEY } from '@/core/hooks/auth'
import { ErrorComponent } from '@tanstack/react-router'
import { ConfirmEmailError } from '@/features/auth/confirm-email/components/confirm-email-error'

const confirmSearchSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email().optional(),
  hash: z.string().nonempty(),
  expires: z.number().int().positive(),
  signature: z.string().nonempty(),
})

export const Route = createFileRoute('/(auth)/_authenticated/confirm-email')({
  validateSearch: confirmSearchSchema,
  loaderDeps: ({ search: { id, email, hash, expires, signature } }) => ({
    id,
    email,
    hash,
    expires,
    signature,
  }),
  loader: async ({ context, deps }) => {
    const queryClient = context.queryClient
    const { id, email, hash, expires, signature } = deps

    await core.fetch(
      email
        ? `/api/c/auth/user/email/new/verify/${id}/${email}/${hash}`
        : `/api/c/auth/user/email/verify/${id}/${hash}`,
      {
        params: { expires: `${expires}`, signature },
      },
    )

    await queryClient.refetchQueries({ queryKey: AUTH_USER_QUERY_KEY })

    throw redirect({ to: '/', search: { verified: true } })
  },
  errorComponent: ({ error }) => {
    if (isFetchError(error)) return <ConfirmEmailError />

    return <ErrorComponent error={error} />
  },
})
