import { useAuthUser } from '@/core/hooks/auth'
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
import { ProfileEmailForm } from './profile-email-form'

export function ProfileEmail() {
  const { user } = useAuthUser()

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
            Your current email address is <strong>{user?.email}</strong>. Please
            enter a new email and we will send you a verification link.
          </DialogDescription>
        </DialogHeader>
        <ProfileEmailForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
