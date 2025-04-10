'use client'

import { useCallback, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ProfilePasswordForm } from './profile-password-form'

export function ProfilePassword() {
  const [open, setOpen] = useState(false)

  const handleSuccess = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-fit">
          Change password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>
            Use a password at least 15 letters long, or at least 8 characters
            long with both letters and numbers.
          </DialogDescription>
        </DialogHeader>
        <ProfilePasswordForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
