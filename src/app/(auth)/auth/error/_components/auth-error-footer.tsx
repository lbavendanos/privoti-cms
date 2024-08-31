'use client'

import { useAuth } from '@/core/auth'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { LoginFooter } from '@/app/(auth)/login/_components/login-footer'
import Link from 'next/link'

function AuthErrorFooterFallback() {
  return (
    <div className="mt-6 flex flex-col items-center gap-y-1">
      <Skeleton className="h-4 w-[200px]" />
    </div>
  )
}

export function AuthErrorFooter() {
  const { isLoading, check } = useAuth()

  if (isLoading) return <AuthErrorFooterFallback />

  return (
    <div className="mt-6 space-y-1 text-center">
      <p className="text-center text-sm text-muted-foreground">
        {check ? (
          <>
            Regresa al{' '}
            <Button variant="link" className="h-fit w-fit p-0" asChild>
              <Link href="/">inicio</Link>
            </Button>
          </>
        ) : (
          <LoginFooter />
        )}
      </p>
    </div>
  )
}
