'use client'

import { logout } from '@/core/actions/new/auth'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { startTransition, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { VerifyEmailForm } from './verify-email-form'

export function VerifyEmail() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const handleLogout = useCallback(() => {
    startTransition(async () => {
      await logout()

      queryClient.clear()
      router.push('/login')
    })
  }, [router, queryClient])

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-center text-3xl font-bold tracking-tight lg:text-4xl">
        Thanks for signing up!
      </h1>
      <p className="text-center text-base text-muted-foreground lg:text-lg">
        Before getting started, could you verify your email address by clicking
        on the link we just emailed to you? If you didn&apos;t receive the
        email, we will gladly send you another.
      </p>
      <div className="space-y-2">
        <VerifyEmailForm />
        <Button
          type="submit"
          variant="outline"
          className="w-full"
          onClick={handleLogout}
        >
          Log out
        </Button>
      </div>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        If you have already verified your email, you can back to{' '}
        <Button variant="link" className="h-fit w-fit p-0" asChild>
          <Link href="/">home</Link>
        </Button>
      </p>
    </div>
  )
}
