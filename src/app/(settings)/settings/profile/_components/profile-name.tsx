'use client'

import { useCallback, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ProfileNameForm } from './profile-name-form'

export function ProfileName() {
  const [open, setOpen] = useState(false)

  const handleSuccess = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-fit">
          Change name
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit name</DialogTitle>
          <DialogDescription>
            Make changes to your name here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <ProfileNameForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
