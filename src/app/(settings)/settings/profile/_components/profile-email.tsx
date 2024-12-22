'use client'

import { useProfile } from './profile-context'
import { useCallback, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ProfileEmailForm } from './profile-email-form'

export function ProfileEmail() {
  const { user } = useProfile()
  const [open, setOpen] = useState(false)

  const handleSuccess = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-fit">
          Change email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change email</DialogTitle>
          <DialogDescription>
            Your current email address is <strong>{user.email}</strong>. Please
            enter a new email and we will send you a verification link.
          </DialogDescription>
        </DialogHeader>
        <ProfileEmailForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
