import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog'

const route = getRouteApi('/_authenticated/(app)/')

export function DashboardVerifyAlert() {
  const navigate = useNavigate()
  const search = route.useSearch()

  const [open, setOpen] = useState(false)

  const handleClick = useCallback(() => {
    navigate({ to: '/', replace: true })
    setOpen(false)
  }, [])

  useEffect(() => {
    if (search.verified) {
      setOpen(true)
    }
  }, [search])

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
