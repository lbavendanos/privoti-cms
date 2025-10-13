import type { Customer } from '@/core/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ProfileForm } from './profile-form'

type ProfileDialogProps = {
  customer?: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileDialog({
  customer,
  open,
  onOpenChange,
}: ProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {customer ? 'Edit customer' : 'Create customer'}
          </DialogTitle>
          <DialogDescription>
            {customer
              ? 'Edit the customer details below.'
              : 'Fill in the customer details below to create a new customer.'}
          </DialogDescription>
        </DialogHeader>
        <ProfileForm
          customer={customer}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
