'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export function HomeEmailVerifyAlert() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [open, setOpen] = useState(false)

  const handleClick = useCallback(() => {
    router.replace('/')
    setOpen(false)
  }, [router])

  useEffect(() => {
    if (searchParams.has('verified')) {
      setOpen(true)
    }
  }, [searchParams])

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Email verification successful!</AlertDialogTitle>
          <AlertDialogDescription>
            Your email has been verified successfully and you can now enjoy all
            the platform&apos;s features.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleClick}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
